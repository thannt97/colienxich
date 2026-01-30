import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../../../../server/src/types';

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

// Get server URL from URL parameter, localStorage, or default
const getServerUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const serverParam = urlParams.get('server');
  if (serverParam) return serverParam;

  const localStorageUrl = localStorage.getItem('viteSocketUrl');
  if (localStorageUrl) return localStorageUrl;

  return import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
};

const SOCKET_URL = getServerUrl();

// Singleton socket instance
let globalSocket: SocketType | null = null;
let globalListenersSetup = false;
let mySocketId: string | null = null; // Track my socket id

interface UseSocketReturn {
  socket: SocketType | null;
  isConnected: boolean;
  isInQueue: boolean;
  opponentId: string | null;
  gameSessionId: string | null;
  myPlayerRole: 'player1' | 'player2' | null; // Add my player role
}

// Local state for singleton
const socketState = {
  isConnected: false,
  isInQueue: false,
  opponentId: null as string | null,
  gameSessionId: null as string | null,
  myPlayerRole: null as 'player1' | 'player2' | null,
  listeners: new Set<() => void>(),
};

export const useSocket = (): UseSocketReturn => {
  const [, forceUpdate] = useState({});
  const listenerRef = useRef<() => void>(() => forceUpdate({}));

  useEffect(() => {
    // Add listener to trigger re-render when state changes
    socketState.listeners.add(listenerRef.current);

    return () => {
      socketState.listeners.delete(listenerRef.current);
    };
  }, []);

  // Create socket connection if not exists
  if (!globalSocket) {
    console.log('🔌 Creating new socket connection...');
    globalSocket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  // Setup global event listeners only once
  if (!globalListenersSetup && globalSocket) {
    globalSocket.on('connect', () => {
      console.log('✅ Connected to server:', globalSocket?.id);
      mySocketId = globalSocket?.id || null; // Store my socket id
      socketState.isConnected = true;
      socketState.listeners.forEach(fn => fn());
    });

    globalSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    globalSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      socketState.isConnected = false;
      socketState.isInQueue = false;
      socketState.opponentId = null;
      socketState.gameSessionId = null;
      socketState.listeners.forEach(fn => fn());
    });

    globalSocket.on('match-found', (data: { opponentId: string; gameSessionId: string }) => {
      console.log('🎮 Match found event received:', data);
      socketState.opponentId = data.opponentId;
      socketState.gameSessionId = data.gameSessionId;
      socketState.isInQueue = false;
      console.log('🔄 Notifying', socketState.listeners.size, 'listeners');
      socketState.listeners.forEach(fn => fn());
    });

    // Listen for game-state to determine player role
    globalSocket.on('game-state', (gameState: {
      players: Array<{ id: string; socketId: string; ready: boolean }>;
      currentPlayer: string;
      currentTurn: 'player1' | 'player2';
    }) => {
      console.log('🎮 Game state received, determining my role...');
      // Determine my player role based on my socket id
      if (mySocketId) {
        const playerIndex = gameState.players.findIndex(p => p.socketId === mySocketId);
        if (playerIndex === 0) {
          socketState.myPlayerRole = 'player1';
        } else if (playerIndex === 1) {
          socketState.myPlayerRole = 'player2';
        }
        console.log('🎭 My player role:', socketState.myPlayerRole);
        socketState.listeners.forEach(fn => fn());
      }
    });

    globalSocket.on('opponent-disconnected', () => {
      console.log('👋 Opponent disconnected');
      socketState.opponentId = null;
      socketState.gameSessionId = null;
      socketState.listeners.forEach(fn => fn());
    });

    globalListenersSetup = true;
  }

  return {
    socket: globalSocket,
    isConnected: socketState.isConnected,
    isInQueue: socketState.isInQueue,
    opponentId: socketState.opponentId,
    gameSessionId: socketState.gameSessionId,
    myPlayerRole: socketState.myPlayerRole,
  };
};
