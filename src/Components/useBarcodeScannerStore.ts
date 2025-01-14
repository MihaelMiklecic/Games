import { create } from "zustand";
import useScannerInfo from "./useScannerInfo";

declare global {
  interface Navigator {
    serial: Serial;
    bluetooth: Bluetooth;
  }

  interface Bluetooth {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  }

  interface BluetoothDevice {
    gatt: BluetoothRemoteGATTServer;
  }

  interface BluetoothRemoteGATTServer {
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
  }
  type BluetoothServiceUUID = string | number;

  interface BluetoothDeviceFilter {
    services?: BluetoothServiceUUID[];
    name?: string;
    namePrefix?: string;
    manufacturerData?: Map<number, DataFilter>;
    serviceData?: Map<BluetoothServiceUUID, DataFilter>;
  }

  interface DataFilter {
    dataPrefix?: ArrayBuffer;
    mask?: ArrayBuffer;
  }

  interface RequestDeviceOptions {
    filters?: BluetoothDeviceFilter[];
    optionalServices?: BluetoothServiceUUID[];
    acceptAllDevices?: boolean;
  }

  interface Serial {
    getPorts(): Promise<SerialPort[]>;
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
  }

  interface SerialPortRequestOptions {
    filters: SerialPortFilter[];
  }

  interface SerialPortFilter {
    usbVendorId?: number;
    usbProductId?: number;
  }

  interface SerialPort {
    readable: ReadableStream;
    writable: WritableStream;
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
  }

  interface SerialOptions {
    baudRate: number;
  }
}
interface BarcodeScannerState {
  serialPort: SerialPort | null;
  isConnected: boolean;
  receivedData: string;
  lastScanTimestamp: number | null;
  bluetoothDevice: BluetoothDevice | null;
  bluetoothServer: BluetoothRemoteGATTServer | null;
  websocket: WebSocket | null;
  websocketConnected: boolean;
}

interface BarcodeScannerActions {
  setSerialPort: (port: SerialPort | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setReceivedData: (data: string) => void;
  connectSerialPort: () => Promise<void>;
  startReading: () => Promise<void>;
  disconnectSerialPort: () => void;
  sendData: (data: object) => Promise<void>;
  updateLastScanTimestamp: () => void;
  setBluetoothDevice: (device: BluetoothDevice | null) => void;
  connectBluetoothDevice: () => Promise<void>;
  disconnectBluetoothDevice: () => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  sendWebSocketMessage: (
    message: string | ArrayBufferLike | Blob | ArrayBufferView
  ) => void;
}
interface BarcodeScannerStore
  extends BarcodeScannerState,
    BarcodeScannerActions {}
const useBarcodeScannerStore = create<BarcodeScannerStore>((set, get) => ({
  serialPort: null,
  isConnected: false,
  lastScanTimestamp: null,
  bluetoothDevice: null,
  bluetoothServer: null,
  websocket: null,
  websocketConnected: false,
  receivedData: "",
  updateLastScanTimestamp: () => {
    set({ lastScanTimestamp: Date.now() });

    setTimeout(() => {
      set({ lastScanTimestamp: null });
    }, 1000);
  },
  resetLastScanTimestamp: () => {
    set({ lastScanTimestamp: null });
  },
  setBluetoothDevice: (device: BluetoothDevice | null) =>
    set({ bluetoothDevice: device }),
  setSerialPort: (port) => set({ serialPort: port }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setReceivedData: (data) => set({ receivedData: data }),
  sendData: async (data: object) => {
    const { serialPort } = get();
    if (!serialPort || !serialPort.writable) {
      console.error("Serial port is not connected or not writable.");
      return;
    }

    let writer;
    try {
      writer = serialPort.writable.getWriter();
      const jsonData = JSON.stringify(data);
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(jsonData + "\n");
      await writer.write(encodedData);
      console.log("Data sent to serial port:", jsonData);
    } catch (error) {
      console.error("Error sending data to serial port:", error);
    } finally {
      if (writer) {
        writer.releaseLock();
      }
    }
  },
  connectSerialPort: async () => {
    if ("serial" in navigator) {
      try {
        const ports = await navigator.serial.getPorts();
        console.log("Ports:", ports.toString() );
        if (ports.length > 0) {
          console.log("Ports found:", ports);
          const port = ports[0];
          await port.open({ baudRate: 9600 });
          set({ serialPort: port, isConnected: true });
          console.log("Connected to serial port", port);
          return;
        } else {
          const port = await navigator.serial.requestPort();
          await port.open({ baudRate: 9600 });
          set({ serialPort: port, isConnected: true });
          console.log("Connected to serial port", port);
          return;
        }
      } catch (err) {
        console.error("There was an error opening the serial port:", err);
      }
    } else {
      console.log("Web Serial API not supported.");
    }

    get().connectWebSocket();
  },
  startReading: async () => {
    const { serialPort, updateLastScanTimestamp } = get();
    const setDataObj = useScannerInfo.getState().setDataObj;
    console.log("Starting to read...", serialPort);
    if (serialPort && get().isConnected) {
      const textDecoder = new TextDecoderStream();
      serialPort.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      try {
        let accumulatedData = "";
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log("Stream closed");
            break;
          }
          if (value) {
            accumulatedData += value;
            if (accumulatedData.includes("\n")) {
              accumulatedData.split("\n").forEach((line) => {
                if (line.trim()) {
                  try {
                    const dataObj = JSON.parse(line);
                    const scanCode = dataObj.scan_code;
                    updateLastScanTimestamp();
                    setDataObj(dataObj);
                    console.log("Received data:", scanCode);
                    set({ receivedData: scanCode });
                  } catch (error) {
                    console.error("Error parsing data from serial port", error);
                  }
                }
              });
              accumulatedData = "";
            }
          }
        }
      } catch (error) {
        console.error("Error reading from serial port", error);
      } finally {
        reader.releaseLock();
      }
    }
  },
  disconnectSerialPort: async () => {
    const { serialPort, setIsConnected, setSerialPort, setReceivedData } =
      get();
    if (serialPort) {
      try {
        await serialPort.close();
        console.log("Serial port closed successfully.");
        setSerialPort(null);
        setIsConnected(false);
        setReceivedData("");
      } catch (error) {
        console.error("Error closing the serial port:", error);
      }
    } else {
      console.log("No serial port to disconnect.");
    }
  },
  connectBluetoothDevice: async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      });
      const server = await device.gatt.connect();
      set({
        bluetoothDevice: device,
        bluetoothServer: server,
        isConnected: true,
      });
    } catch (error) {
      console.error("Error connecting to Bluetooth device:", error);
      set({ bluetoothDevice: null, bluetoothServer: null, isConnected: false });
    }
  },

  disconnectBluetoothDevice: () => {
    const { bluetoothDevice } = get();
    if (bluetoothDevice?.gatt.connect) {
      bluetoothDevice.gatt.disconnect();
      set({ bluetoothDevice: null, bluetoothServer: null });
    }
  },

  connectWebSocket: () => {
    const websocket = new WebSocket("ws://localhost:9998");
    websocket.onopen = () => {
      console.log("WebSocket connection opened.");
      set({ websocketConnected: true, isConnected: true }); // Update isConnected here
    };
    websocket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      console.log(event);
      const dataObj = JSON.parse(event.data);
      const scanCode = dataObj.scan_code;
      console.log("Received data:", scanCode);
      get().updateLastScanTimestamp();
      set({ receivedData: scanCode });
    };
    websocket.onclose = () => {
      console.log("WebSocket connection closed.");
      set({ websocket: null, websocketConnected: false, isConnected: false }); // Update isConnected here
    };
    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      set({ websocketConnected: false, isConnected: false }); // Update isConnected here
    };
    set({ websocket });
  },

  disconnectWebSocket: () => {
    get().websocket?.close();
    set({ isConnected: false });
  },

  sendWebSocketMessage: (message) => {
    if (get().websocketConnected && get().websocket) {
      get().websocket?.send(message);
    } else {
      console.log("WebSocket is not connected.");
    }
  },
}));

export default useBarcodeScannerStore;
