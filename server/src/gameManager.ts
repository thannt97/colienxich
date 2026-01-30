import { Player, GameState } from './types';

interface GameSession {
  id: string;
  players: Player[];
  gameState: GameState;
  createdAt: Date;
}

class GameManager {
  private matchmakingQueue: Player[] = [];
  private activeGames: Map<string, GameSession> = new Map();

  // Add player to matchmaking queue
  addToQueue(player: Player): void {
    this.matchmakingQueue.push(player);
    console.log(`👤 Player ${player.id} joined queue. Queue size: ${this.matchmakingQueue.length}`);
  }

  // Remove player from queue
  removeFromQueue(socketId: string): void {
    this.matchmakingQueue = this.matchmakingQueue.filter(p => p.socketId !== socketId);
  }

  // Check if there are enough players to start a game
  findMatch(): [Player, Player] | null {
    if (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift()!;
      const player2 = this.matchmakingQueue.shift()!;

      console.log(`🎮 Match found: ${player1.id} vs ${player2.id}`);
      return [player1, player2];
    }
    return null;
  }

  // Create a new game session
  createGameSession(player1: Player, player2: Player): GameSession {
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const initialGameState: GameState = {
      players: [player1, player2],
      currentPlayer: player1.socketId,
      currentTurn: 'player1',
      lines: [],
      triangles: [],
      scores: { player: 0, opponent: 0 },
      gameStatus: 'playing',
      winner: null,
    };

    const gameSession: GameSession = {
      id: gameId,
      players: [player1, player2],
      gameState: initialGameState,
      createdAt: new Date(),
    };

    this.activeGames.set(gameId, gameSession);
    console.log(`✅ Game session created: ${gameId}`);

    return gameSession;
  }

  // Get game session by ID
  getGameSession(gameId: string): GameSession | undefined {
    return this.activeGames.get(gameId);
  }

  // Get game session by player socket ID
  getGameBySocketId(socketId: string): GameSession | undefined {
    for (const game of this.activeGames.values()) {
      if (game.players.some(p => p.socketId === socketId)) {
        return game;
      }
    }
    return undefined;
  }

  // Update game state
  updateGameState(gameId: string, newState: Partial<GameState>): void {
    const game = this.activeGames.get(gameId);
    if (game) {
      game.gameState = { ...game.gameState, ...newState };
    }
  }

  // Remove game session
  removeGameSession(gameId: string): void {
    this.activeGames.delete(gameId);
    console.log(`🗑️ Game session removed: ${gameId}`);
  }

  // Get queue size
  getQueueSize(): number {
    return this.matchmakingQueue.length;
  }
}

// Export singleton instance
export const gameManager = new GameManager();
