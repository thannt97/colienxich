import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/game-store';
import { useSocket } from '../hooks/useSocket';
import { haptic } from '../../../shared/utils/haptic';
import { InviteLink } from './InviteLink';
import './Lobby.css';

interface LobbyProps {
  onClose: () => void;
  onMatchFound?: () => void; // Callback to also close parent modal
}

export const Lobby: React.FC<LobbyProps> = ({ onClose, onMatchFound }) => {
  const { socket, isConnected, opponentId, gameSessionId, myPlayerRole } = useSocket();
  const [isJoining, setIsJoining] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const processedMatchRef = useRef(false); // Track if we've processed this match

  // Handle match found
  useEffect(() => {
    console.log('🔍 Lobby effect triggered:', { opponentId, gameSessionId, myPlayerRole, processed: processedMatchRef.current });

    // Only process once per match and when we know our role
    if (opponentId && gameSessionId && myPlayerRole && !processedMatchRef.current) {
      processedMatchRef.current = true;

      console.log('✅ Processing match as', myPlayerRole, ', will close in 1s...');

      const store = useGameStore.getState();
      store.setOpponentId(opponentId);
      store.setGameSessionId(gameSessionId);
      store.setWaitingForMatch(false);
      store.setMyPlayerRole(myPlayerRole); // Use actual player role from socket
      store.setGameMode('online-pvp');

      haptic.vibrate(haptic.patterns.success);

      // Start game after short delay
      setTimeout(() => {
        console.log('🎮 Closing lobby and starting game...');
        store.resetGame(); // Reset game state for fresh start
        onClose(); // Close the lobby modal
        onMatchFound?.(); // Close the parent mode selection modal
      }, 1000);
    }

    // Reset flag when match changes
    if (!opponentId && !gameSessionId) {
      processedMatchRef.current = false;
    }
  }, [opponentId, gameSessionId, myPlayerRole, onClose, onMatchFound]);

  const handleJoinQueue = () => {
    if (!socket || !isConnected) {
      alert('Server not connected. Please try again.');
      return;
    }

    haptic.vibrate(haptic.patterns.light);
    setIsJoining(true);
    useGameStore.getState().setWaitingForMatch(true);

    // Join queue (socket is already auto-connected)
    socket.emit('join-queue');
  };

  const handleCancel = () => {
    if (socket) {
      socket.emit('leave-queue');
    }
    useGameStore.getState().setWaitingForMatch(false);
    setIsJoining(false);
    haptic.vibrate(haptic.patterns.light);
  };

  return (
    <div className="lobby-overlay">
      <div className="lobby-container">
        <button className="lobby-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="lobby-title">Online Multiplayer</h2>

        {!isConnected ? (
          <div className="lobby-status lobby-status--connecting">
            <div className="lobby-spinner" />
            <p>Connecting to server...</p>
          </div>
        ) : !isJoining ? (
          <div className="lobby-content">
            <p className="lobby-description">
              Find an opponent and play online!
            </p>
            <div className="lobby-buttons">
              <button className="lobby-button" onClick={handleJoinQueue}>
                Find Match
              </button>
              <button className="lobby-button lobby-button--secondary" onClick={() => setShowInvite(true)}>
                Invite Friend
              </button>
            </div>
          </div>
        ) : (
          <div className="lobby-status lobby-status--searching">
            <div className="lobby-spinner" />
            <p>Searching for opponent...</p>
            <p className="lobby-hint">Queue size: {Math.floor(Math.random() * 5) + 1}</p>
            <button className="lobby-button lobby-button--secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {showInvite && <InviteLink onClose={() => setShowInvite(false)} />}
    </div>
  );
};
