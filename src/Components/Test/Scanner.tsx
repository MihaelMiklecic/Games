import {  useState } from "react";
import useBarcodeScannerStore from "../useBarcodeScannerStore";

const ScannerComponent: React.FC = () => {

  const {
    receivedData,
    connectSerialPort,
    startReading,
    disconnectSerialPort,
    isConnected,
  } = useBarcodeScannerStore((state) => ({
    receivedData: state.receivedData,
    connectSerialPort: state.connectSerialPort,
    startReading: state.startReading,
    disconnectSerialPort: state.disconnectSerialPort,
    isConnected: state.isConnected,
  }));


  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true); 
    try {
      await connectSerialPort();
      await startReading(); 
    } catch (error) {
      console.error("Error initializing scanner:", error);
    } finally {
      setIsConnecting(false); 
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectSerialPort();
    } catch (error) {
      console.error("Error disconnecting scanner:", error);
    }
  };

  return (
    <div>
      <h1>Scanner Component</h1>
      {isConnected ? (
        <div>
          <p>Scanner is connected!</p>
          <p>Received Data: {receivedData}</p>
          <button onClick={startReading}>Start Reading Data</button>
          <button onClick={handleDisconnect}>Disconnect from Serial Port</button>
        </div>
      ) : (
        <div>
          <p>Scanner is not connected.</p>
          <button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect to Serial Port"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ScannerComponent;
