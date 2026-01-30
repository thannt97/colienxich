import { AxialCoord, generateHexGrid } from './grid-utils';
import { hasLine, Line } from './triangle-detector';

/**
 * Game score interface
 */
export interface GameScore {
    player: number;
    opponent: number;
}

/**
 * Winner type
 */
export type Winner = 'player' | 'opponent' | 'draw' | null;

/**
 * Checks if there are any valid moves remaining on the board.
 * A valid move is any pair of adjacent pegs that doesn't already have a line.
 *
 * @param lines - Array of existing lines on the board
 * @param radius - Board radius (default: 3 for standard game)
 * @returns true if there are valid moves remaining, false otherwise
 */
export const hasValidMoves = (lines: Line[], radius: number = 3): boolean => {
    // Generate all pegs on the board
    const pegs = generateHexGrid(radius);

    // Check each pair of adjacent pegs
    for (let i = 0; i < pegs.length; i++) {
        const p1 = pegs[i];

        // Get all adjacent pegs to p1
        for (let j = i + 1; j < pegs.length; j++) {
            const p2 = pegs[j];

            // Check if p2 is adjacent to p1 (distance = 1)
            if (isAdjacent(p1, p2)) {
                // Check if there's already a line between these pegs
                if (!hasLine(lines, p1, p2)) {
                    return true; // Found a valid move
                }
            }
        }
    }

    return false; // No valid moves found
};

/**
 * Checks if the game should end based on current board state.
 * Game ends when there are no valid moves remaining.
 *
 * @param lines - Array of existing lines on the board
 * @param radius - Board radius (default: 3 for standard game)
 * @returns true if game should end, false otherwise
 */
export const checkGameOver = (lines: Line[], radius: number = 3): boolean => {
    return !hasValidMoves(lines, radius);
};

/**
 * Determines the winner based on final scores.
 *
 * @param scores - Current game scores
 * @returns 'player' if player wins, 'opponent' if opponent wins, 'draw' if tied
 */
export const determineWinner = (scores: GameScore): Winner => {
    if (scores.player > scores.opponent) {
        return 'player';
    } else if (scores.opponent > scores.player) {
        return 'opponent';
    } else {
        return 'draw';
    }
};

/**
 * Checks if two pegs are adjacent (distance = 1 in hex grid)
 */
const isAdjacent = (p1: AxialCoord, p2: AxialCoord): boolean => {
    const dq = Math.abs(p1.q - p2.q);
    const dr = Math.abs(p1.r - p2.r);
    const ds = Math.abs((-p1.q - p1.r) - (-p2.q - p2.r));
    const distance = Math.max(dq, dr, ds);
    return distance === 1;
};
