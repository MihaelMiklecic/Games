import useBarcodeScannerStore from "./Components/useBarcodeScannerStore";
export const testSkenera = () => {
    const {
      isConnected,
      receivedData,
      connectSerialPort,
      disconnectSerialPort,
      startReading,
    } = useBarcodeScannerStore();
  
    return (
      <div>
        <h1>Barcode Scanner</h1>
        <button onClick={connectSerialPort}>Connect Serial Port</button>
        <button onClick={startReading}>Start Reading</button>
        <button onClick={disconnectSerialPort}>Disconnect Serial Port</button>
        <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
        <div>Received Data: {receivedData}</div>
      </div>
    );
  }
  export default testSkenera;
    {/*<SnackbarProvider maxSnack={1}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/glavni-izbornik" element={<GlavniIzbornik />} />
          <Route path="/otpremnica" element={<Otpremnica />} />
          <Route path="/ispis-naljepnice" element={<IspisNaljepnice />} />
        </Routes>
      </Router>
    </SnackbarProvider>*/}