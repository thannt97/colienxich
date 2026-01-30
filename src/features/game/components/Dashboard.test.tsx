import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../store/game-store';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
    beforeEach(() => {
        // Reset store state before each test
        useGameStore.getState().resetGame();
    });

    it('should render player and opponent scores', () => {
        act(() => {
            useGameStore.setState({ score: { player: 5, opponent: 3 } });
        });

        render(<Dashboard />);

        expect(screen.getByText('5')).toBeDefined(); // Player score
        expect(screen.getByText('3')).toBeDefined(); // Opponent score
    });

    it('should show turn indicator for player when it is player\'s turn', () => {
        act(() => {
            useGameStore.setState({ currentTurn: 'player' });
        });

        render(<Dashboard />);

        expect(screen.getByText('YOUR TURN')).toBeDefined();
    });

    it('should show turn indicator for opponent when it is opponent\'s turn', () => {
        act(() => {
            useGameStore.setState({ currentTurn: 'opponent' });
        });

        render(<Dashboard />);

        expect(screen.getByText('THEIR TURN')).toBeDefined();
    });

    it('should apply active class to player card when it is player\'s turn', () => {
        act(() => {
            useGameStore.setState({ currentTurn: 'player' });
        });

        const { container } = render(<Dashboard />);

        const playerCard = container.querySelector('.score-card.player');
        expect(playerCard?.classList.contains('active')).toBe(true);
    });

    it('should apply active class to opponent card when it is opponent\'s turn', () => {
        act(() => {
            useGameStore.setState({ currentTurn: 'opponent' });
        });

        const { container } = render(<Dashboard />);

        const opponentCard = container.querySelector('.score-card.opponent');
        expect(opponentCard?.classList.contains('active')).toBe(true);
    });

    it('should not apply active class to player card when it is opponent\'s turn', () => {
        act(() => {
            useGameStore.setState({ currentTurn: 'opponent' });
        });

        const { container } = render(<Dashboard />);

        const playerCard = container.querySelector('.score-card.player');
        expect(playerCard?.classList.contains('active')).toBe(false);
    });

    it('should not apply active class to opponent card when it is player\'s turn', () => {
        act(() => {
            useGameStore.setState({ currentTurn: 'player' });
        });

        const { container } = render(<Dashboard />);

        const opponentCard = container.querySelector('.score-card.opponent');
        expect(opponentCard?.classList.contains('active')).toBe(false);
    });

    it('should display VS text between scores', () => {
        render(<Dashboard />);

        expect(screen.getByText('VS')).toBeDefined();
    });

    it('should call resetGame when reset button is clicked', () => {
        render(<Dashboard />);

        const resetButton = screen.getByTitle('Reset Game');
        act(() => {
            resetButton.click();
        });

        // Verify store was reset (scores back to 0, turn back to player)
        expect(useGameStore.getState().score.player).toBe(0);
        expect(useGameStore.getState().score.opponent).toBe(0);
        expect(useGameStore.getState().currentTurn).toBe('player');
    });

    it('should update turn indicator dynamically when turn changes', () => {
        const { container } = render(<Dashboard />);

        // Start with player's turn
        expect(screen.getByText('YOUR TURN')).toBeDefined();

        // Change to opponent's turn
        act(() => {
            useGameStore.setState({ currentTurn: 'opponent' });
        });

        expect(screen.getByText('THEIR TURN')).toBeDefined();
        expect(screen.queryByText('YOUR TURN')).toBeNull();
    });

    it('should update scores dynamically when scores change', () => {
        render(<Dashboard />);

        // Initial scores - use getAllByText because there are multiple '0's
        expect(screen.getAllByText('0')).toHaveLength(2);

        // Update scores
        act(() => {
            useGameStore.setState({ score: { player: 10, opponent: 7 } });
        });

        expect(screen.getByText('10')).toBeDefined();
        expect(screen.getByText('7')).toBeDefined();
    });
});
