import React from 'react';
import { useGameStore } from '../store/game-store';
import './GameOverModal.css';

export const GameOverModal: React.FC = () => {
    const { gameStatus, winner, score, resetGame } = useGameStore();

    // Don't render if game is not over
    if (gameStatus !== 'gameOver') {
        return null;
    }

    // Determine message and result class based on winner
    const getResultMessage = (): string => {
        if (winner === 'player') return 'You Win!';
        if (winner === 'opponent') return 'You Lose!';
        return 'Draw!';
    };

    const getResultClass = (): string => {
        if (winner === 'player') return 'win';
        if (winner === 'opponent') return 'lose';
        return 'draw';
    };

    const resultMessage = getResultMessage();
    const resultClass = getResultClass();

    const handlePlayAgain = () => {
        resetGame();
    };

    return (
        <div className="game-over-overlay">
            <div className="game-over-modal">
                <h2 className={`result ${resultClass}`}>
                    {resultMessage}
                </h2>

                <div className="scores">
                    <div className="score-item">
                        <span className="score-label">Player</span>
                        <span className="score-value">{score.player}</span>
                    </div>
                    <div className="score-divider">:</div>
                    <div className="score-item">
                        <span className="score-label">Opponent</span>
                        <span className="score-value">{score.opponent}</span>
                    </div>
                </div>

                <button
                    className="play-again-button"
                    onClick={handlePlayAgain}
                    aria-label="Play again"
                >
                    Chơi lại
                </button>
            </div>
        </div>
    );
};
