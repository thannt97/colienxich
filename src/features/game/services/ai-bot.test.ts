import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomMove, ValidMove, calculateAllValidMoves } from './ai-bot';
import { isValidStraightLine } from '../logic/grid-utils';
import { Line } from '../logic/triangle-detector';

// Mock dependencies
vi.mock('../logic/grid-utils', () => ({
  isValidStraightLine: vi.fn(),
  generateHexGrid: vi.fn(() => [
    { q: 0, r: 0 },
    { q: 1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: 1 },
  ]),
}));

describe('AI Bot Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRandomMove', () => {
    it('should return null when validMoves array is empty', () => {
      const validMoves: ValidMove[] = [];
      const result = getRandomMove(validMoves);
      expect(result).toBeNull();
    });

    it('should return the only move when there is exactly one valid move', () => {
      const validMoves: ValidMove[] = [
        { start: { q: 0, r: 0 }, end: { q: 3, r: 0 } },
      ];
      const result = getRandomMove(validMoves);
      expect(result).toEqual(validMoves[0]);
    });

    it('should return a random move from the validMoves array', () => {
      const validMoves: ValidMove[] = [
        { start: { q: 0, r: 0 }, end: { q: 3, r: 0 } },
        { start: { q: 1, r: 0 }, end: { q: 1, r: 3 } },
        { start: { q: -1, r: 0 }, end: { q: 2, r: 0 } },
      ];

      // Mock Math.random to return 0.5 (middle index)
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const result = getRandomMove(validMoves);
      expect(result).toEqual(validMoves[1]);
      expect(validMoves).toContain(result);
    });

    it('should handle Math.random returning 0 (first element)', () => {
      const validMoves: ValidMove[] = [
        { start: { q: 0, r: 0 }, end: { q: 3, r: 0 } },
        { start: { q: 1, r: 0 }, end: { q: 1, r: 3 } },
      ];

      vi.spyOn(Math, 'random').mockReturnValue(0);

      const result = getRandomMove(validMoves);
      expect(result).toEqual(validMoves[0]);
    });

    it('should handle Math.random returning nearly 1 (last element)', () => {
      const validMoves: ValidMove[] = [
        { start: { q: 0, r: 0 }, end: { q: 3, r: 0 } },
        { start: { q: 1, r: 0 }, end: { q: 1, r: 3 } },
      ];

      vi.spyOn(Math, 'random').mockReturnValue(0.999);

      const result = getRandomMove(validMoves);
      expect(result).toEqual(validMoves[1]);
    });
  });

  describe('calculateAllValidMoves', () => {
    it('should return empty array when no valid moves exist', () => {
      const existingLines: Line[] = [];
      const pegs = [
        { q: 0, r: 0 },
        { q: 1, r: 0 },
      ];

      vi.mocked(isValidStraightLine).mockReturnValue(false);

      const result = calculateAllValidMoves(existingLines, pegs);
      expect(result).toEqual([]);
    });

    it('should return all valid moves that pass validation', () => {
      const existingLines: Line[] = [];
      const pegs = [
        { q: 0, r: 0 },
        { q: 3, r: 0 },
        { q: 1, r: 0 },
        { q: 1, r: 3 },
      ];

      vi.mocked(isValidStraightLine).mockImplementation((q1, r1, q2, r2) => {
        // Only lines with distance 3 are valid
        return (q1 === 0 && r1 === 0 && q2 === 3 && r2 === 0) ||
               (q1 === 1 && r1 === 0 && q2 === 1 && r2 === 3);
      });

      const result = calculateAllValidMoves(existingLines, pegs);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        start: { q: 0, r: 0 },
        end: { q: 3, r: 0 }
      });
      expect(result).toContainEqual({
        start: { q: 1, r: 0 },
        end: { q: 1, r: 3 }
      });
    });

    it('should exclude moves that duplicate existing lines', () => {
      const existingLines: Line[] = [
        { start: { q: 0, r: 0 }, end: { q: 3, r: 0 } },
      ];
      const pegs = [
        { q: 0, r: 0 },
        { q: 3, r: 0 },
        { q: 1, r: 0 },
        { q: 1, r: 3 },
      ];

      vi.mocked(isValidStraightLine).mockReturnValue(true);

      const result = calculateAllValidMoves(existingLines, pegs);

      // Should not include the duplicate line
      expect(result).not.toContainEqual({
        start: { q: 0, r: 0 },
        end: { q: 3, r: 0 }
      });
    });

    it('should handle bidirectional line checking (reverse direction)', () => {
      const existingLines: Line[] = [
        { start: { q: 3, r: 0 }, end: { q: 0, r: 0 } },
      ];
      const pegs = [
        { q: 0, r: 0 },
        { q: 3, r: 0 },
      ];

      vi.mocked(isValidStraightLine).mockReturnValue(true);

      const result = calculateAllValidMoves(existingLines, pegs);

      // Should not include the duplicate line even in reverse
      expect(result).toHaveLength(0);
    });

    it('should exclude invalid lines that do not pass isValidStraightLine', () => {
      const existingLines: Line[] = [];
      const pegs = [
        { q: 0, r: 0 },
        { q: 1, r: 0 },
        { q: 3, r: 0 },
      ];

      vi.mocked(isValidStraightLine).mockImplementation((q1, r1, q2, r2) => {
        // Only line (0,0) to (3,0) is valid
        return q1 === 0 && r1 === 0 && q2 === 3 && r2 === 0;
      });

      const result = calculateAllValidMoves(existingLines, pegs);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        start: { q: 0, r: 0 },
        end: { q: 3, r: 0 }
      });
    });
  });

  describe('Integration: calculateAllValidMoves + getRandomMove', () => {
    it('should work together to return a random valid move', () => {
      const existingLines: Line[] = [];
      const pegs = [
        { q: 0, r: 0 },
        { q: 3, r: 0 },
        { q: 1, r: 0 },
        { q: 1, r: 3 },
      ];

      vi.mocked(isValidStraightLine).mockReturnValue(true);
      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const validMoves = calculateAllValidMoves(existingLines, pegs);
      const randomMove = getRandomMove(validMoves);

      expect(randomMove).not.toBeNull();
      expect(validMoves).toContain(randomMove);
    });

    it('should return null when no valid moves exist', () => {
      const existingLines: Line[] = [];
      const pegs = [
        { q: 0, r: 0 },
        { q: 1, r: 0 },
      ];

      vi.mocked(isValidStraightLine).mockReturnValue(false);

      const validMoves = calculateAllValidMoves(existingLines, pegs);
      const randomMove = getRandomMove(validMoves);

      expect(randomMove).toBeNull();
    });
  });
});
