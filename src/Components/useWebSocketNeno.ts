import { create } from 'zustand';

interface WebSocketAction {
  websocket: WebSocket | null; 
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  isConnected: boolean;
  messages: string[]; 
  addMessage: (message: string) => void;
  sendMessage: (message: string) => void;
}

const useWebSocketNeno = create<WebSocketAction>((set, get) => ({
  websocket: null, 
  isConnected: false,
  messages: [],

  connectWebSocket: () => {
    const websocket = new WebSocket("ws://10.0.11.34:1234");

    websocket.onopen = () => {
      console.log("WebSocket connection opened.");
      set({ isConnected: true });
      websocket.send("Test");
    };

    websocket.onmessage = (event) => {
      const data = event.data;
      console.log("WebSocket message:", data);
      get().addMessage(data);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed.");
      set({ isConnected: false });
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      set({ isConnected: false });
    };


    set({ websocket });
  },

  disconnectWebSocket: () => {
    const websocket = get().websocket;
    if (websocket) {
      websocket.close();
    }
    set({ websocket: null, isConnected: false });
    console.log("WebSocket connection closed.");
  },

  addMessage: (message: string) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  sendMessage: () => {
    const websocket = get().websocket;
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send("Test");
    }
  }
}));


export default useWebSocketNeno;
