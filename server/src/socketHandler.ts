import { Server, Socket } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents } from './types';
import { gameManager } from './gameManager';

type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

export const setupSocketHandlers = (io: Server<ServerToClientEvents, ClientToServerEvents>) => {
  io.on('connection', (socket: SocketInstance) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Handle join queue
    socket.on('join-queue', () => {
      const player = {
        id: socket.id.substr(0, 8),
        socketId: socket.id,
        ready: true,
      };

      console.log(`📥 Player ${player.id} joined queue. Queue size: ${gameManager.getQueueSize()}`);
      gameManager.addToQueue(player);

      // Check for match
      const match = gameManager.findMatch();
      if (match) {
        const [player1, player2] = match;

        // Create game session
        const gameSession = gameManager.createGameSession(player1, player2);

        console.log(`🎮 Match found: ${player1.id} vs ${player2.id}, Session: ${gameSession.id}`);

        // Notify both players
        io.to(player1.socketId).emit('match-found', {
          opponentId: player2.id,
          gameSessionId: gameSession.id,
        });

        io.to(player2.socketId).emit('match-found', {
          opponentId: player1.id,
          gameSessionId: gameSession.id,
        });

        // Send initial game state to both players
        io.to(player1.socketId).emit('game-state', gameSession.gameState);
        io.to(player2.socketId).emit('game-state', gameSession.gameState);
      }
    });

    // Handle leave queue
    socket.on('leave-queue', () => {
      gameManager.removeFromQueue(socket.id);
      console.log(`👋 Client left queue: ${socket.id}`);
    });

    // Handle player move
    socket.on('player-move', (move) => {
      // Find the game this player is in
      const gameSession = gameManager.getGameBySocketId(socket.id);

      if (!gameSession) {
        socket.emit('error', 'Not in an active game');
        return;
      }

      // Check if it's this player's turn
      if (gameSession.gameState.currentPlayer !== socket.id) {
        socket.emit('error', 'Not your turn');
        return;
      }

      // Determine which player made the move
      const currentPlayerIndex = gameSession.gameState.players.findIndex(p => p.socketId === socket.id);
      const player: 'player1' | 'player2' = currentPlayerIndex === 0 ? 'player1' : 'player2';

      // Create line with player info
      const lineWithPlayer = {
        ...move,
        player,
      };

      // Add line to game state
      gameSession.gameState.lines.push(lineWithPlayer);

      // Switch turn
      gameSession.gameState.currentTurn = gameSession.gameState.currentTurn === 'player1' ? 'player2' : 'player1';
      gameSession.gameState.currentPlayer = gameSession.gameState.players[
        gameSession.gameState.currentTurn === 'player1' ? 0 : 1
      ].socketId;

      // Broadcast line added to both players
      io.to(gameSession.players[0].socketId).emit('line-added', lineWithPlayer);
      io.to(gameSession.players[1].socketId).emit('line-added', lineWithPlayer);

      // Broadcast updated game state to both players
      io.to(gameSession.players[0].socketId).emit('game-state', gameSession.gameState);
      io.to(gameSession.players[1].socketId).emit('game-state', gameSession.gameState);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);

      // Remove from queue if in queue
      gameManager.removeFromQueue(socket.id);

      // Check if player was in an active game
      const gameSession = gameManager.getGameBySocketId(socket.id);

      if (gameSession) {
        // Notify opponent
        const opponent = gameSession.players.find(p => p.socketId !== socket.id);
        if (opponent) {
          io.to(opponent.socketId).emit('opponent-disconnected');
        }

        // Remove game session
        gameManager.removeGameSession(gameSession.id);
      }
    });
  });
};
