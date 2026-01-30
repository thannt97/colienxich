import React, { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { Lobby } from './Lobby';
import './ModeSelection.css';

interface ModeSelectionProps {
  onClose?: () => void;
  showWhenActive?: boolean; // When true, show even if game is active
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onClose, showWhenActive = false }) => {
  const { gameMode, setGameMode, gameStatus } = useGameStore();
  const [showLobby, setShowLobby] = useState(false);

  // Don't show mode selection if game is in progress (unless showWhenActive is true)
  if (!showWhenActive && (gameStatus === 'active' || gameStatus === 'paused')) {
    return null;
  }

  const handleModeChange = (mode: 'single-player' | 'hotseat' | 'online-pvp') => {
    if (mode === 'online-pvp') {
      setShowLobby(true);
    } else {
      setGameMode(mode);
      // Reset game when changing mode
      useGameStore.getState().resetGame();
      // Close the mode selection
      onClose?.();
    }
  };

  const handleStartGame = () => {
    // Reset game to start fresh
    useGameStore.getState().resetGame();
  };

  return (
    <div className="mode-selection">
      <div className="mode-selection-container">
        <h2>Chọn chế độ chơi</h2>
        <p>Choose your game mode</p>

        <div className="mode-options">
          <button
            className={`mode-option ${gameMode === 'single-player' ? 'active' : ''}`}
            onClick={() => handleModeChange('single-player')}
          >
            <div className="mode-icon">👤</div>
            <div className="mode-info">
              <h3>Single Player</h3>
              <p>Chơi với AI Bot</p>
            </div>
          </button>

          <button
            className={`mode-option ${gameMode === 'hotseat' ? 'active' : ''}`}
            onClick={() => handleModeChange('hotseat')}
          >
            <div className="mode-icon">👥</div>
            <div className="mode-info">
              <h3>Hotseat</h3>
              <p>2 người chơi tại chỗ</p>
            </div>
          </button>

          <button
            className="mode-option mode-option--online"
            onClick={() => handleModeChange('online-pvp')}
          >
            <div className="mode-icon">🌐</div>
            <div className="mode-info">
              <h3>Online PvP</h3>
              <p>Chơi với người online</p>
            </div>
          </button>
        </div>

        {showLobby && <Lobby onClose={() => setShowLobby(false)} onMatchFound={onClose} />}

        <button className="start-button" onClick={handleStartGame}>
          Bắt đầu / Start Game
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
