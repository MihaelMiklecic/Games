import WebSocket, { Server } from 'ws';

const wss = new Server({ port: 5173 });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  // Listen for messages from the client
  ws.on('message', (message: string) => {
    console.log('Received message from client:', message);
    
    // Send a response back to the client
    ws.send('Hello, client!');
  });

  // Send a welcome message when the connection is first established
  ws.send('Welcome to the WebSocket server!');
});

console.log('WebSocket server is running on ws://localhost:5173');
