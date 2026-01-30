// Shared types between client and server

export interface Player {
  id: string;
  socketId: string;
  ready: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayer: string; // socketId
  currentTurn: 'player1' | 'player2';
  lines: Array<{ start: { q: number; r: number }, end: { q: number; r: number }, player: 'player1' | 'player2' }>;
  triangles: Array<{
    vertices: [{ q: number; r: number }, { q: number; r: number }, { q: number; r: number }];
    player: 'player1' | 'player2';
  }>;
  scores: { player: number; opponent: number };
  gameStatus: 'waiting' | 'playing' | 'gameOver';
  winner: 'player' | 'opponent' | 'draw' | null;
}

export interface ServerToClientEvents {
  // Match found
  'match-found': (data: { opponentId: string; gameSessionId: string }) => void;

  // Game state updates
  'game-state': (state: GameState) => void;

  // Player moves
  'line-added': (line: { start: { q: number; r: number }, end: { q: number; r: number }, player: 'player1' | 'player2' }) => void;

  // Opponent disconnected
  'opponent-disconnected': () => void;

  // Game over
  'game-over': (winner: 'player' | 'opponent' | 'draw') => void;

  // Error
  'error': (message: string) => void;
}

export interface ClientToServerEvents {
  // Join matchmaking
  'join-queue': () => void;

  // Leave queue
  'leave-queue': () => void;

  // Player move
  'player-move': (move: { start: { q: number; r: number }, end: { q: number; r: number } }) => void;

  // Disconnect
  'disconnect': () => void;
}
