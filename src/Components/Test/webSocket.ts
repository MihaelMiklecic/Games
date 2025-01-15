class WebSocketClient {
    private socket: WebSocket | null = null;
  
    public connect(url: string): void {
      this.socket = new WebSocket(url);
  
      this.socket.onopen = (event: Event) => {
        console.log('WebSocket connection established', event);
        this.onConnect(); 
      };
  
      this.socket.onmessage = (event: MessageEvent) => {
        console.log('Message from server:', event.data);
      };
  
      this.socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket closed:', event);
        if (event.code !== 1000) { 
          console.error('Connection closed unexpectedly');
        }
      };
      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
      };
    }
  
    public sendMessage(message: string): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);  
        console.log('Message sent:', message);
      } else {
        console.error('WebSocket is not open. Message not sent.');
      }
    }
  
    private onConnect(): void {
      const initialMessage = JSON.stringify({ type: 'greeting', content: 'Hello, Server!' });
      this.sendMessage(initialMessage);
    }
  }
  
  const wsClient = new WebSocketClient();
  
  wsClient.connect('ws://localhost:5173');
  
  setTimeout(() => {
    wsClient.sendMessage('This is a message after connection is open.');
  }, 2000);
  