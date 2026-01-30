import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socketHandler';

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      /\.ngrok-free\.app$/,  // Allow any ngrok subdomain
      'https://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup Socket.io event handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🎮 Game server running on port ${PORT}`);
  console.log(`📡 Waiting for players to connect...`);
});
