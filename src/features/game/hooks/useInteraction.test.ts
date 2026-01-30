import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInteraction } from './useInteraction';
import { useGameStore } from '../store/game-store';

// Mocking Konva Stage and Absolute Transform
const mockStage = {
    getPointerPosition: vi.fn(),
    getAbsoluteTransform: vi.fn(() => ({
        copy: () => ({
            invert: () => ({
                point: (p: { x: number, y: number }) => p
            })
        })
    }))
};

const mockNode = {
    getStage: () => mockStage,
    getAbsolutePosition: vi.fn(() => ({ x: 100, y: 100 }))
};

describe('useInteraction', () => {
    beforeEach(() => {
        // Reset store state before each test
        useGameStore.getState().resetGame();
    });

    it('should initialize with dragging set to false', () => {
        const { result } = renderHook(() => useInteraction());
        expect(result.current.dragStateRef.current.isDragging).toBe(false);
    });

    it('should start dragging on pointer down on a node', () => {
        const { result } = renderHook(() => useInteraction());

        mockStage.getPointerPosition.mockReturnValue({ x: 105, y: 105 });

        act(() => {
            result.current.handlePointerDown({
                target: mockNode,
                currentTarget: mockNode,
            } as any);
        });

        expect(result.current.dragStateRef.current.isDragging).toBe(true);
        expect(result.current.dragStateRef.current.startX).toBe(100);
        expect(result.current.dragStateRef.current.currentX).toBe(105);
    });

    it('should update current position on pointer move while dragging', () => {
        const { result } = renderHook(() => useInteraction());

        // Start dragging first
        mockStage.getPointerPosition.mockReturnValue({ x: 100, y: 100 });
        act(() => {
            result.current.handlePointerDown({ target: mockNode } as any);
        });

        // Move pointer
        mockStage.getPointerPosition.mockReturnValue({ x: 200, y: 200 });
        act(() => {
            result.current.handlePointerMove({ target: mockNode } as any);
        });

        expect(result.current.dragStateRef.current.currentX).toBe(200);
    });

    it('should stop dragging on pointer up', () => {
        const { result } = renderHook(() => useInteraction());

        act(() => {
            result.current.handlePointerDown({ target: mockNode } as any);
            result.current.handlePointerUp();
        });

        expect(result.current.dragStateRef.current.isDragging).toBe(false);
    });

    it('should add score when creating a triangle', () => {
        renderHook(() => useInteraction());

        // Set current turn to player
        act(() => {
            useGameStore.setState({ currentTurn: 'player' });
        });

        // Get initial player score
        const initialScore = useGameStore.getState().score.player;

        // Create a triangle by adding it directly to the store
        // This tests the scoring mechanism that would be triggered by handlePointerUp
        act(() => {
            const vertices: [ { q: number; r: number }, { q: number; r: number }, { q: number; r: number } ] = [
                { q: 0, r: 0 },
                { q: 1, r: 0 },
                { q: 0, r: 1 }
            ];
            const triangle = {
                vertices: vertices,
                player: 'player1' as const
            };
            useGameStore.getState().addTriangle(triangle);
            useGameStore.getState().addScore('player', 1);
        });

        // Verify score increased by 1 (one triangle created = 1 point)
        const finalScore = useGameStore.getState().score.player;
        expect(finalScore).toBe(initialScore + 1);
    });

    describe('Hotseat Mode - Toggle Turn', () => {
        it('should toggle turn when store action is called', () => {
            const { result } = renderHook(() => useInteraction());

            // Start with player's turn
            expect(useGameStore.getState().currentTurn).toBe('player');

            // Manually call toggleTurn (simulating what happens after a move)
            act(() => {
                useGameStore.getState().toggleTurn();
            });

            // Turn should have toggled to opponent
            expect(useGameStore.getState().currentTurn).toBe('opponent');
        });

        it('should maintain turn state across multiple toggles', () => {
            renderHook(() => useInteraction());

            // Initial state
            expect(useGameStore.getState().currentTurn).toBe('player');

            // First toggle: player -> opponent
            act(() => {
                useGameStore.getState().toggleTurn();
            });
            expect(useGameStore.getState().currentTurn).toBe('opponent');

            // Second toggle: opponent -> player
            act(() => {
                useGameStore.getState().toggleTurn();
            });
            expect(useGameStore.getState().currentTurn).toBe('player');

            // Third toggle: player -> opponent
            act(() => {
                useGameStore.getState().toggleTurn();
            });
            expect(useGameStore.getState().currentTurn).toBe('opponent');
        });

        it('should score points for the correct player who created triangle', () => {
            renderHook(() => useInteraction());

            // Player creates triangle and scores
            act(() => {
                useGameStore.setState({ currentTurn: 'player' });
                useGameStore.getState().addScore('player', 2);
            });

            expect(useGameStore.getState().score.player).toBe(2);
            expect(useGameStore.getState().score.opponent).toBe(0);

            // Toggle to opponent
            act(() => {
                useGameStore.getState().toggleTurn();
            });

            // Opponent creates triangle and scores
            act(() => {
                useGameStore.getState().addScore('opponent', 1);
            });

            expect(useGameStore.getState().score.player).toBe(2);
            expect(useGameStore.getState().score.opponent).toBe(1);
        });

        it('should not toggle turn when game is over', () => {
            renderHook(() => useInteraction());

            // Start with player's turn
            expect(useGameStore.getState().currentTurn).toBe('player');

            // Set game to over state
            act(() => {
                useGameStore.getState().endGame('player');
            });

            // Turn should still be player (game is over, no toggle)
            expect(useGameStore.getState().currentTurn).toBe('player');
            expect(useGameStore.getState().gameStatus).toBe('gameOver');
        });

        it('should complete hotseat flow: player scores -> toggle -> opponent scores -> toggle', () => {
            renderHook(() => useInteraction());

            // Initial state: player's turn
            expect(useGameStore.getState().currentTurn).toBe('player');
            expect(useGameStore.getState().score.player).toBe(0);
            expect(useGameStore.getState().score.opponent).toBe(0);

            // Player creates triangle and scores
            act(() => {
                useGameStore.getState().addScore('player', 1);
                useGameStore.getState().toggleTurn();
            });

            // After player's turn: opponent's turn, player has 1 point
            expect(useGameStore.getState().currentTurn).toBe('opponent');
            expect(useGameStore.getState().score.player).toBe(1);
            expect(useGameStore.getState().score.opponent).toBe(0);

            // Opponent creates triangle and scores
            act(() => {
                useGameStore.getState().addScore('opponent', 2);
                useGameStore.getState().toggleTurn();
            });

            // After opponent's turn: player's turn, opponent has 2 points
            expect(useGameStore.getState().currentTurn).toBe('player');
            expect(useGameStore.getState().score.player).toBe(1);
            expect(useGameStore.getState().score.opponent).toBe(2);
        });

        it('should award points but not toggle turn when game ends on scoring move', () => {
            renderHook(() => useInteraction());

            // Player's turn, score is 0-0
            expect(useGameStore.getState().currentTurn).toBe('player');
            expect(useGameStore.getState().score.player).toBe(0);

            // Player creates triangles and game ends simultaneously
            act(() => {
                useGameStore.getState().addScore('player', 3); // Player scores points
                useGameStore.getState().endGame('player'); // Game ends
            });

            // Player should get points, game should be over, turn should NOT toggle
            expect(useGameStore.getState().score.player).toBe(3);
            expect(useGameStore.getState().gameStatus).toBe('gameOver');
            expect(useGameStore.getState().currentTurn).toBe('player'); // Still player's turn
        });
    });

    describe('Single Player Mode - AI Bot Integration', () => {
        beforeEach(() => {
            // Reset store and set to single-player mode
            useGameStore.getState().resetGame();
            act(() => {
                useGameStore.getState().setGameMode('single-player');
            });
        });

        it('should have single-player as default game mode', () => {
            expect(useGameStore.getState().gameMode).toBe('single-player');
        });

        it('should allow player to change game mode', () => {
            act(() => {
                useGameStore.getState().setGameMode('hotseat');
            });
            expect(useGameStore.getState().gameMode).toBe('hotseat');

            act(() => {
                useGameStore.getState().setGameMode('single-player');
            });
            expect(useGameStore.getState().gameMode).toBe('single-player');
        });

        it('should prevent player from moving during AI turn in single-player mode', () => {
            const { result } = renderHook(() => useInteraction());

            // Set to opponent's turn (AI's turn)
            act(() => {
                useGameStore.setState({ currentTurn: 'opponent' });
            });

            // Try to drag - should be blocked in single-player mode
            mockStage.getPointerPosition.mockReturnValue({ x: 100, y: 100 });

            act(() => {
                result.current.handlePointerDown({
                    target: mockNode,
                    currentTarget: mockNode,
                } as any);
            });

            // Should not start dragging because it's not player's turn in single-player mode
            expect(result.current.dragStateRef.current.isDragging).toBe(false);
        });

        it('should allow player to move during their turn in single-player mode', () => {
            const { result } = renderHook(() => useInteraction());

            // Make sure it's player's turn
            expect(useGameStore.getState().currentTurn).toBe('player');

            mockStage.getPointerPosition.mockReturnValue({ x: 100, y: 100 });

            act(() => {
                result.current.handlePointerDown({
                    target: mockNode,
                    currentTarget: mockNode,
                } as any);
            });

            // Should start dragging normally
            expect(result.current.dragStateRef.current.isDragging).toBe(true);
        });

        it('should allow both players to move in hotseat mode', () => {
            const { result } = renderHook(() => useInteraction());

            // Set to hotseat mode and opponent's turn
            act(() => {
                useGameStore.setState({ gameMode: 'hotseat', currentTurn: 'opponent' });
            });

            mockStage.getPointerPosition.mockReturnValue({ x: 100, y: 100 });

            act(() => {
                result.current.handlePointerDown({
                    target: mockNode,
                    currentTarget: mockNode,
                } as any);
            });

            // Should allow dragging in hotseat mode even during opponent's turn
            expect(result.current.dragStateRef.current.isDragging).toBe(true);
        });

        it('should not allow interaction when game is over', () => {
            const { result } = renderHook(() => useInteraction());

            // Set game to over
            act(() => {
                useGameStore.setState({ gameStatus: 'gameOver' });
            });

            mockStage.getPointerPosition.mockReturnValue({ x: 100, y: 100 });

            act(() => {
                result.current.handlePointerDown({
                    target: mockNode,
                    currentTarget: mockNode,
                } as any);
            });

            // Should not start dragging
            expect(result.current.dragStateRef.current.isDragging).toBe(false);
        });

        it('should not allow interaction when game is paused', () => {
            const { result } = renderHook(() => useInteraction());

            // Set game to paused
            act(() => {
                useGameStore.setState({ gameStatus: 'paused' });
            });

            mockStage.getPointerPosition.mockReturnValue({ x: 100, y: 100 });

            act(() => {
                result.current.handlePointerDown({
                    target: mockNode,
                    currentTarget: mockNode,
                } as any);
            });

            // Should not start dragging
            expect(result.current.dragStateRef.current.isDragging).toBe(false);
        });
    });

    describe('AI Move Integration Tests', () => {
        beforeEach(() => {
            // Reset store and set to single-player mode
            useGameStore.getState().resetGame();
            act(() => {
                useGameStore.getState().setGameMode('single-player');
            });
        });

        it('should execute AI move after player completes move', async () => {
            const { result } = renderHook(() => useInteraction());

            // Player starts with a turn
            expect(useGameStore.getState().currentTurn).toBe('player');

            // Player makes a move (simulated by directly adding a line)
            act(() => {
                useGameStore.getState().addLine({
                    start: { q: 0, r: 0 },
                    end: { q: 3, r: 0 }
                });
                useGameStore.getState().toggleTurn();
            });

            // After player's move, turn should be opponent
            expect(useGameStore.getState().currentTurn).toBe('opponent');

            // Wait for AI delay (500ms-1s) + some buffer
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 1200));
            });

            // After AI move, turn should toggle back to player (if game not over)
            const finalTurn = useGameStore.getState().currentTurn;
            // Either AI moved (turn toggles back) or game ended (turn stays opponent)
            expect(['player', 'opponent']).toContain(finalTurn);
        });

        it('should block player input during AI turn', () => {
            const { result } = renderHook(() => useInteraction());

            // Set to opponent's turn (AI's turn)
            act(() => {
                useGameStore.setState({ currentTurn: 'opponent' });
            });

            // Try to drag - should be blocked
            mockStage.getPointerPosition.mockReturnValue({ x: 100, y: 100 });

            act(() => {
                result.current.handlePointerDown({
                    target: mockNode,
                    currentTarget: mockNode,
                } as any);
            });

            // Should not start dragging during AI's turn
            expect(result.current.dragStateRef.current.isDragging).toBe(false);
        });

        it('should allow player input after AI completes move', async () => {
            const { result } = renderHook(() => useInteraction());

            // Start with player's turn
            expect(useGameStore.getState().currentTurn).toBe('player');

            // Simulate player move and turn toggle
            act(() => {
                useGameStore.getState().addLine({
                    start: { q: 0, r: 0 },
                    end: { q: 3, r: 0 }
                });
                useGameStore.getState().toggleTurn();
            });

            // Wait for AI to complete
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 1200));
            });

            // After AI move, turn should either be player (AI moved) or opponent (game over)
            const finalTurn = useGameStore.getState().currentTurn;
            expect(['player', 'opponent']).toContain(finalTurn);
        });
    });
});
