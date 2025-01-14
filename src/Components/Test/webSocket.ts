class WebSocketClient {
    private socket: WebSocket | null = null;
  
    // Method to establish a WebSocket connection
    public connect(url: string): void {
      // Initialize the WebSocket connection
      this.socket = new WebSocket(url);
  
      // WebSocket connection is established
      this.socket.onopen = (event: Event) => {
        console.log('WebSocket connection established', event);
        this.onConnect();  // You can perform additional actions when connection is open
      };
  
      // Handle incoming messages
      this.socket.onmessage = (event: MessageEvent) => {
        console.log('Message from server:', event.data);
      };
  
      // Handle connection closure
      this.socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket closed:', event);
        // Reconnect or clean up based on the reason for closing
        if (event.code !== 1000) {  // 1000 means normal closure
          console.error('Connection closed unexpectedly');
        }
      };
  
      // Handle WebSocket errors
      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
      };
    }
  
    // Method to send messages after the connection is open
    public sendMessage(message: string): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);  // Send message to the server
        console.log('Message sent:', message);
      } else {
        console.error('WebSocket is not open. Message not sent.');
      }
    }
  
    // Optional: Handle actions after connection is established
    private onConnect(): void {
      // Example: Send an initial message once connected
      const initialMessage = JSON.stringify({ type: 'greeting', content: 'Hello, Server!' });
      this.sendMessage(initialMessage);
    }
  }
  
  // Example usage
  const wsClient = new WebSocketClient();
  
  // Establish WebSocket connection (adjust URL as necessary)
  wsClient.connect('ws://localhost:5173');
  
  // Send a message after ensuring the connection is open
  setTimeout(() => {
    wsClient.sendMessage('This is a message after connection is open.');
  }, 2000);
  