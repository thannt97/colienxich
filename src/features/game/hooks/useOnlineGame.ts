import { useEffect } from 'react';
import { useGameStore } from '../store/game-store';
import { useSocket } from './useSocket';
import { detectNewTriangles, VALID_TRIANGLES } from '../logic/triangle-detector';
import { checkGameOver, determineWinner } from '../logic/game-logic';

const BOARD_RADIUS = 3;

export const useOnlineGame = () => {
  const { socket } = useSocket();
  const gameMode = useGameStore(state => state.gameMode);

  // Listen for game state updates from server
  useEffect(() => {
    if (!socket || gameMode !== 'online-pvp') return;

    const handleGameState = (serverState: {
      scores: { player: number; opponent: number };
      currentTurn: 'player1' | 'player2';
      lines: Array<{ start: { q: number; r: number }, end: { q: number; r: number }, player: 'player1' | 'player2' }>;
      triangles: Array<{
        vertices: [{ q: number; r: number }, { q: number; r: number }, { q: number; r: number }];
        player: 'player1' | 'player2';
      }>;
      gameStatus: 'waiting' | 'playing' | 'gameOver';
      winner: 'player' | 'opponent' | 'draw' | null;
    }) => {
      // Use getState() to avoid dependency issues
      useGameStore.getState().syncGameState(serverState);
    };

    const handleLineAdded = (line: any) => {
      console.log('📐 Line added event received:', line);
      const store = useGameStore.getState();

      // Extract player from line or determine from current turn
      const linePlayer: 'player1' | 'player2' = line.player || (store.currentTurn === 'player' ? 'player1' : 'player2');

      // Add the line
      store.addLine({ start: line.start, end: line.end });

      // Detect triangles after adding the line
      const allLines = [...store.lines, { ...line, player: linePlayer }];
      const newTriangles = detectNewTriangles(allLines, linePlayer, VALID_TRIANGLES);
      console.log('🔺 New triangles detected:', newTriangles);

      // Add only new triangles (deduplicated)
      const existingTriangles = store.triangles;
      const newTrianglesAdded: typeof newTriangles = [];

      for (const triangle of newTriangles) {
        const isDuplicateTriangle = existingTriangles.some(t =>
          t.vertices[0].q === triangle.vertices[0].q &&
          t.vertices[0].r === triangle.vertices[0].r &&
          t.vertices[1].q === triangle.vertices[1].q &&
          t.vertices[1].r === triangle.vertices[1].r &&
          t.vertices[2].q === triangle.vertices[2].q &&
          t.vertices[2].r === triangle.vertices[2].r
        );

        if (!isDuplicateTriangle) {
          store.addTriangle(triangle);
          newTrianglesAdded.push(triangle);
        }
      }

      // Update score: +1 point per triangle created
      if (newTrianglesAdded.length > 0) {
        const scorePlayer = linePlayer === 'player1' ? 'player' : 'opponent';
        store.addScore(scorePlayer, newTrianglesAdded.length);
      }

      // Check for game over
      if (checkGameOver(allLines, BOARD_RADIUS)) {
        const scores = store.score;
        const winner = determineWinner(scores);
        store.endGame(winner);
      } else {
        // Toggle turn if game is not over
        store.toggleTurn();
      }
    };

    const handleGameOver = (winner: 'player' | 'opponent' | 'draw') => {
      useGameStore.getState().endGame(winner);
    };

    socket.on('game-state', handleGameState);
    socket.on('line-added', handleLineAdded);
    socket.on('game-over', handleGameOver);

    return () => {
      socket.off('game-state', handleGameState);
      socket.off('line-added', handleLineAdded);
      socket.off('game-over', handleGameOver);
    };
  }, [socket, gameMode]); // Only depend on socket and gameMode

  // Send player move to server
  const sendPlayerMove = (move: { start: { q: number; r: number }, end: { q: number; r: number } }) => {
    const currentGameMode = useGameStore.getState().gameMode;
    if (socket && currentGameMode === 'online-pvp') {
      socket.emit('player-move', move);
    }
  };

  return {
    sendPlayerMove,
  };
};
