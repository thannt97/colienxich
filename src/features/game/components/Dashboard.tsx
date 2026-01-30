import React, { useState } from 'react';
import { useGameStore } from '../store/game-store';
import { haptic } from '../../../shared/utils/haptic';
import ModeSelection from './ModeSelection';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const score = useGameStore(state => state.score);
    const currentTurn = useGameStore(state => state.currentTurn);
    const resetGame = useGameStore(state => state.resetGame);
    const gameMode = useGameStore(state => state.gameMode);

    const [showModeSelection, setShowModeSelection] = useState(false);

    const handleReset = () => {
        haptic.vibrate(haptic.patterns.medium);
        // Add a small delay for visual feedback before state change if needed
        resetGame();
    };

    const handleChangeMode = () => {
        haptic.vibrate(haptic.patterns.light);
        setShowModeSelection(true);
    };

    const getModeLabel = () => {
        switch (gameMode) {
            case 'single-player': return 'VS AI';
            case 'hotseat': return '2 PLAYER';
            case 'online-pvp': return 'ONLINE';
            default: return '';
        }
    };

    return (
        <div className="dashboard">
            {showModeSelection && <ModeSelection onClose={() => setShowModeSelection(false)} showWhenActive={true} />}

            <div className="score-container">
                {/* Player 1 card - Red theme */}
                <div className={`score-card player player1 ${currentTurn === 'player' ? 'active' : ''}`}>
                    <div className="label">PLAYER</div>
                    <div className="value">{score.player}</div>
                    {currentTurn === 'player' && <div className="turn-indicator player1-turn">YOUR TURN</div>}
                </div>

                <div className="vs-container">
                    <div className="vs">VS</div>
                    <button className="reset-button" onClick={handleReset} title="Reset Game">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                    </button>
                    <button className="mode-button" onClick={handleChangeMode} title="Change Mode">
                        <span className="mode-label">{getModeLabel()}</span>
                    </button>
                </div>

                {/* Player 2 card - Cyan theme */}
                <div className={`score-card opponent player2 ${currentTurn === 'opponent' ? 'active' : ''}`}>
                    <div className="label">OPPONENT</div>
                    <div className="value">{score.opponent}</div>
                    {currentTurn === 'opponent' && <div className="turn-indicator player2-turn">THEIR TURN</div>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
