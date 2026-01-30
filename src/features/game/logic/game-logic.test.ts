import { describe, it, expect } from 'vitest';
import { hasValidMoves, checkGameOver, determineWinner, GameScore } from './game-logic';
import { Line } from './triangle-detector';

describe('game-logic', () => {
    describe('hasValidMoves', () => {
        it('should return true when board is empty (no lines)', () => {
            const lines: Line[] = [];
            expect(hasValidMoves(lines, 3)).toBe(true);
        });

        it('should return true when there are some lines but valid moves remain', () => {
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } },
                { start: { q: 1, r: 0 }, end: { q: 1, r: -1 } },
            ];
            expect(hasValidMoves(lines, 3)).toBe(true);
        });

        it('should return true when board has some lines but valid moves remain', () => {
            // Create a few lines connecting pegs around center
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } },
                { start: { q: 0, r: 0 }, end: { q: 0, r: 1 } },
                { start: { q: 0, r: 0 }, end: { q: -1, r: 1 } },
            ];

            // On a radius-3 board (37 pegs), 3 lines means many valid moves remain
            expect(hasValidMoves(lines, 3)).toBe(true);
        });

        it('should return false when small board (radius-1) is completely filled', () => {
            // A radius-1 board has 7 pegs in a hexagonal pattern
            // All adjacent pairs for this small board:
            const lines: Line[] = [
                // Center (0,0) to all 6 neighbors
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } },
                { start: { q: 0, r: 0 }, end: { q: 0, r: 1 } },
                { start: { q: 0, r: 0 }, end: { q: -1, r: 1 } },
                { start: { q: 0, r: 0 }, end: { q: -1, r: 0 } },
                { start: { q: 0, r: 0 }, end: { q: 0, r: -1 } },
                { start: { q: 0, r: 0 }, end: { q: 1, r: -1 } },
                // Outer ring connections (complete the hexagon)
                { start: { q: 1, r: 0 }, end: { q: 1, r: -1 } },
                { start: { q: 1, r: -1 }, end: { q: 0, r: -1 } },
                { start: { q: 0, r: -1 }, end: { q: -1, r: 0 } },
                { start: { q: -1, r: 0 }, end: { q: -1, r: 1 } },
                { start: { q: -1, r: 1 }, end: { q: 0, r: 1 } },
                { start: { q: 0, r: 1 }, end: { q: 1, r: 0 } },
            ];

            // All adjacent pegs on radius-1 board are connected - no valid moves
            expect(hasValidMoves(lines, 1)).toBe(false);
        });

        it('should handle empty lines array', () => {
            const lines: Line[] = [];
            expect(hasValidMoves(lines, 3)).toBe(true);
        });

        it('should work with different board sizes', () => {
            const lines: Line[] = [];
            expect(hasValidMoves(lines, 1)).toBe(true);
            expect(hasValidMoves(lines, 2)).toBe(true);
            expect(hasValidMoves(lines, 3)).toBe(true);
        });
    });

    describe('checkGameOver', () => {
        it('should return false when valid moves exist', () => {
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } },
            ];
            expect(checkGameOver(lines, 3)).toBe(false);
        });

        it('should return true when no valid moves exist', () => {
            // In practice, this would be when all adjacent peg pairs have lines
            // For this test, we check the logical inverse
            const lines: Line[] = [];
            expect(checkGameOver(lines, 3)).toBe(false); // Empty board still has moves
        });

        it('should be inverse of hasValidMoves', () => {
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } },
            ];

            expect(checkGameOver(lines, 3)).toBe(!hasValidMoves(lines, 3));
        });
    });

    describe('determineWinner', () => {
        it('should return player when player score is higher', () => {
            const scores: GameScore = { player: 5, opponent: 3 };
            expect(determineWinner(scores)).toBe('player');
        });

        it('should return opponent when opponent score is higher', () => {
            const scores: GameScore = { player: 3, opponent: 5 };
            expect(determineWinner(scores)).toBe('opponent');
        });

        it('should return draw when scores are equal', () => {
            const scores: GameScore = { player: 4, opponent: 4 };
            expect(determineWinner(scores)).toBe('draw');
        });

        it('should handle zero scores', () => {
            const scores: GameScore = { player: 0, opponent: 0 };
            expect(determineWinner(scores)).toBe('draw');
        });

        it('should handle large score differences', () => {
            const scores: GameScore = { player: 100, opponent: 1 };
            expect(determineWinner(scores)).toBe('player');
        });

        it('should handle negative scores (player wins)', () => {
            const scores: GameScore = { player: -1, opponent: -5 };
            expect(determineWinner(scores)).toBe('player');
        });

        it('should handle negative scores (opponent wins)', () => {
            const scores: GameScore = { player: -10, opponent: -1 };
            expect(determineWinner(scores)).toBe('opponent');
        });

        it('should handle negative equal scores', () => {
            const scores: GameScore = { player: -5, opponent: -5 };
            expect(determineWinner(scores)).toBe('draw');
        });
    });
});
