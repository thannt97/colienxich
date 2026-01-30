import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/game-store';
import ModeSelection from './ModeSelection';

describe('ModeSelection Component', () => {
    beforeEach(() => {
        // Reset store state before each test
        useGameStore.getState().resetGame();
    });

    it('should render mode selection when game is not active', () => {
        useGameStore.setState({ gameStatus: 'gameOver' });

        render(<ModeSelection />);

        expect(screen.getByText('Chọn chế độ chơi')).toBeDefined();
        expect(screen.getByText('Choose your game mode')).toBeDefined();
    });

    it('should not render when game is active', () => {
        useGameStore.setState({ gameStatus: 'active' });

        const { container } = render(<ModeSelection />);

        expect(container.firstChild).toBeNull();
    });

    it('should not render when game is paused', () => {
        useGameStore.setState({ gameStatus: 'paused' });

        const { container } = render(<ModeSelection />);

        expect(container.firstChild).toBeNull();
    });

    it('should display both mode options', () => {
        useGameStore.setState({ gameStatus: 'gameOver' });

        render(<ModeSelection />);

        expect(screen.getByText('Single Player')).toBeDefined();
        expect(screen.getByText('Chơi với AI Bot')).toBeDefined();
        expect(screen.getByText('Hotseat')).toBeDefined();
        expect(screen.getByText('2 người chơi tại chỗ')).toBeDefined();
    });

    it('should highlight single-player mode when selected', () => {
        useGameStore.setState({ gameStatus: 'gameOver', gameMode: 'single-player' });

        const { container } = render(<ModeSelection />);

        const singlePlayerButton = container.querySelector('.mode-option.active');
        expect(singlePlayerButton).not.toBeNull();
        expect(screen.getByText('Single Player')).toBeDefined();
    });

    it('should highlight hotseat mode when selected', () => {
        useGameStore.setState({ gameStatus: 'gameOver', gameMode: 'hotseat' });

        const { container } = render(<ModeSelection />);

        const hotseatButton = container.querySelector('.mode-option.active');
        expect(hotseatButton).not.toBeNull();
        expect(screen.getByText('Hotseat')).toBeDefined();
    });

    it('should switch to single-player mode when clicked', () => {
        useGameStore.setState({ gameStatus: 'gameOver', gameMode: 'hotseat' });

        const { container } = render(<ModeSelection />);

        const singlePlayerButton = container.querySelectorAll('.mode-option')[0];
        fireEvent.click(singlePlayerButton);

        expect(useGameStore.getState().gameMode).toBe('single-player');
    });

    it('should switch to hotseat mode when clicked', () => {
        useGameStore.setState({ gameStatus: 'gameOver', gameMode: 'single-player' });

        const { container } = render(<ModeSelection />);

        const hotseatButton = container.querySelectorAll('.mode-option')[1];
        fireEvent.click(hotseatButton);

        expect(useGameStore.getState().gameMode).toBe('hotseat');
    });

    it('should reset game when start button is clicked', () => {
        useGameStore.setState({
            gameStatus: 'gameOver',
            score: { player: 5, opponent: 3 },
            currentTurn: 'opponent'
        });

        render(<ModeSelection />);

        const startButton = screen.getByText('Bắt đầu / Start Game');
        fireEvent.click(startButton);

        expect(useGameStore.getState().score.player).toBe(0);
        expect(useGameStore.getState().score.opponent).toBe(0);
        expect(useGameStore.getState().currentTurn).toBe('player');
    });

    it('should set game mode to single-player when store is initialized', () => {
        // Clear store state and set to single-player explicitly
        useGameStore.getState().setGameMode('single-player');
        useGameStore.setState({ gameStatus: 'gameOver' });

        render(<ModeSelection />);

        expect(useGameStore.getState().gameMode).toBe('single-player');
    });
});
