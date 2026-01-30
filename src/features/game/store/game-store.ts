import { create } from 'zustand'
import { Triangle, Line } from '../logic/triangle-detector'
import { Winner } from '../logic/game-logic'

export type GameMode = 'single-player' | 'hotseat' | 'online-pvp';

interface GameScore {
    player: number;
    opponent: number;
}

interface GameState {
    score: GameScore;
    currentTurn: 'player' | 'opponent';
    gameStatus: 'active' | 'gameOver' | 'paused';
    gameMode: GameMode;
    winner: Winner;
    resetCounter: number; // Used for triggering visual effects on reset
    lines: Line[];
    triangles: Triangle[];
    // Online PvP specific state
    isWaitingForMatch: boolean;
    opponentId: string | null;
    gameSessionId: string | null;
    myPlayerRole: 'player1' | 'player2' | null; // In online mode, which role am I?
    addScore: (player: 'player' | 'opponent', amount: number) => void;
    addLine: (line: Omit<Line, 'player'>) => void; // player is auto-added from currentTurn
    addTriangle: (triangle: Triangle) => void;
    toggleTurn: () => void;
    endGame: (winner: Winner) => void;
    resetGame: () => void;
    setGameMode: (mode: GameMode) => void;
    // Online PvP methods
    setWaitingForMatch: (waiting: boolean) => void;
    setOpponentId: (opponentId: string | null) => void;
    setGameSessionId: (sessionId: string | null) => void;
    setMyPlayerRole: (role: 'player1' | 'player2' | null) => void;
    syncGameState: (serverState: {
        scores: { player: number; opponent: number };
        currentTurn: 'player1' | 'player2';
        lines: Line[];
        triangles: Triangle[];
        gameStatus: 'waiting' | 'playing' | 'gameOver';
        winner: 'player' | 'opponent' | 'draw' | null;
    }) => void;
}

export const useGameStore = create<GameState>((set) => ({
    score: { player: 0, opponent: 0 },
    currentTurn: 'player',
    gameStatus: 'active',
    gameMode: 'single-player', // Default to single-player mode
    winner: null,
    resetCounter: 0,
    lines: [],
    triangles: [],
    // Online PvP state
    isWaitingForMatch: false,
    opponentId: null,
    gameSessionId: null,
    myPlayerRole: null,
    addScore: (player, amount) => set((state) => ({
        score: {
            ...state.score,
            [player]: state.score[player] + amount
        }
    })),
    addLine: (line) => set((state) => {
        // Auto-determine player from current turn
        const player: 'player1' | 'player2' = state.currentTurn === 'player' ? 'player1' : 'player2';
        return {
            lines: [...state.lines, { ...line, player }]
        };
    }),
    addTriangle: (triangle) => set((state) => ({
        triangles: [...state.triangles, triangle]
    })),
    toggleTurn: () => set((state) => ({
        currentTurn: state.currentTurn === 'player' ? 'opponent' : 'player'
    })),
    endGame: (winner) => set(() => ({
        gameStatus: 'gameOver',
        winner
    })),
    resetGame: () => set((state) => ({
        score: { player: 0, opponent: 0 },
        currentTurn: 'player',
        gameStatus: 'active',
        winner: null,
        resetCounter: state.resetCounter + 1,
        lines: [],
        triangles: []
    })),
    setGameMode: (mode) => set(() => ({
        gameMode: mode
    })),
    // Online PvP methods
    setWaitingForMatch: (waiting) => set(() => ({
        isWaitingForMatch: waiting
    })),
    setOpponentId: (opponentId) => set(() => ({
        opponentId
    })),
    setGameSessionId: (sessionId) => set(() => ({
        gameSessionId: sessionId
    })),
    setMyPlayerRole: (role) => set(() => ({
        myPlayerRole: role
    })),
    syncGameState: (serverState) => set((state) => ({
        // Keep local scores and triangles (computed client-side)
        score: state.score,
        triangles: state.triangles,
        // Only sync authoritative server state
        currentTurn: serverState.currentTurn === 'player1' ? 'player' : 'opponent',
        lines: serverState.lines,
        gameStatus: serverState.gameStatus === 'playing' ? 'active' : serverState.gameStatus === 'gameOver' ? 'gameOver' : 'paused',
        winner: serverState.winner
    }))
}))
