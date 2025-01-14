import { Container } from "@mui/material";
import { Header } from "./HomePageUtilities/Header";
import { PrijavaOperatera } from "./HomePageUtilities/PrijavaOperatera";
import { Footer } from "./HomePageUtilities/Footer";
import useWebSocketNeno from "../useWebSocketNeno";
import { useEffect } from "react";
import { AppSimulator } from "../AppSimulatorComponents/AppSimulator";
import AppSimulatorTest from "../AppSimulatorComponents/AppSimulatorTest";
export const HomePage = () => {
  {
    /*const {isConnected, connectWebSocket, disconnectWebSocket, messages, sendMessage} = useWebSocketNeno();

useEffect(()  => {
  messages.forEach((message) => console.log(message));
})

const connect = () => {
  connectWebSocket();
};
const disconnect = () => {
  disconnectWebSocket();
}

const posaljiPoruku = () => {
  sendMessage("test");
}*/
  }
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        textAlign: "center",
        p: 1,
      }}
    >
      {/*<Header/> 
      <PrijavaOperatera/>
      <Footer/>*/}
      {/*<AppSimulator/>
      <AppSimulatorTest/>*/}

      {/*WEBSOCKET   <h1>WebSocket Test</h1>
    <p>Status: {isConnected ? "Connected" : "Not connected"}</p>
    <button onClick={connect}>
      Connect
    </button>
    <button onClick={disconnect}>
      Disconnect
    </button>
    <button onClick={() => {console.log(messages)}}>Poruke</button>
    <button onClick={posaljiPoruku}>
      Pošaji poruku
    </button>*/}
      <Header />
      <PrijavaOperatera />
      <Footer />
    </Container>
  );
};
