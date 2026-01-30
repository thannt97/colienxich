import { AxialCoord } from '../logic/grid-utils';
import { isValidStraightLine } from '../logic/grid-utils';
import { hasLine, Line } from '../logic/triangle-detector';

export interface ValidMove {
  start: AxialCoord;
  end: AxialCoord;
}

/**
 * Randomly selects a move from a list of valid moves.
 * This is a "dumb AI" implementation - no strategy, just random selection.
 *
 * @param validMoves - Array of valid moves to choose from
 * @returns A random valid move, or null if no moves available
 */
export const getRandomMove = (validMoves: ValidMove[]): ValidMove | null => {
  if (validMoves.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * validMoves.length);
  return validMoves[randomIndex];
};

/**
 * Calculates all valid moves on the current board.
 * A valid move is a straight line through exactly 4 pegs that doesn't duplicate an existing line.
 *
 * Performance: O(n²) where n = number of pegs (37 pegs for BOARD_RADIUS=3)
 * Worst-case: 37×36/2 = 666 iterations, which is negligible for 60 FPS
 * This calculation runs once per AI turn, not every frame.
 *
 * @param existingLines - Lines that have already been played
 * @param pegs - All pegs on the board
 * @returns Array of all valid moves (start and end peg coordinates)
 */
export const calculateAllValidMoves = (existingLines: Line[], pegs: AxialCoord[]): ValidMove[] => {
  const validMoves: ValidMove[] = [];

  // Check each pair of pegs
  for (let i = 0; i < pegs.length; i++) {
    for (let j = i + 1; j < pegs.length; j++) {
      const start = pegs[i];
      const end = pegs[j];

      // Check if line is straight (distance 3, 4 pegs total)
      if (!isValidStraightLine(start.q, start.r, end.q, end.r)) {
        continue;
      }

      // Check if line already exists (bidirectional check)
      if (hasLine(existingLines, start, end)) {
        continue;
      }

      // This is a valid move
      validMoves.push({ start, end });
    }
  }

  return validMoves;
};
