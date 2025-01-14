import useBarcodeScannerStore from "./useBarcodeScannerStore";

const useInitializeConnection = () => {
  const { connectWebSocket, connectSerialPort, startReading } =
    useBarcodeScannerStore();

  const initializeConnection = async () => {
    const userAgent = navigator.userAgent.toLowerCase();

    const isTablet =
      /ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(
        userAgent
      );

    try {
      if (!isTablet) {
        await connectSerialPort();
        await startReading();
      } else {
        await connectWebSocket();
      }
    } catch (error) {
      console.error("Connection failed", error);
    }
  };

  return { initializeConnection };
};

export default useInitializeConnection;
