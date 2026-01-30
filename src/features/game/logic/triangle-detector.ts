import { AxialCoord } from './grid-utils'

export interface Triangle {
    vertices: [AxialCoord, AxialCoord, AxialCoord]
    player: 'player1' | 'player2'
}

export interface Line {
    start: AxialCoord
    end: AxialCoord
    player: 'player1' | 'player2'
}

/**
 * Generates all valid size-1 triangles for a hexagonal grid with given radius.
 * A size-1 triangle has 3 vertices that are all adjacent (distance = 1).
 */
export const generateValidTriangles = (radius: number): AxialCoord[][] => {
    const triangles: AxialCoord[][] = []
    const seen = new Set<string>()

    // Generate all pegs on the grid
    const pegs: AxialCoord[] = []
    for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius)
        const r2 = Math.min(radius, -q + radius)
        for (let r = r1; r <= r2; r++) {
            pegs.push({ q, r })
        }
    }

    // For each peg, check all possible triangles with adjacent pegs
    for (const p1 of pegs) {
        // Get all adjacent pegs to p1
        const adjacent1 = getAdjacentPegs(p1, pegs)

        for (const p2 of adjacent1) {
            // Get all adjacent pegs to p2
            const adjacent2 = getAdjacentPegs(p2, pegs)

            for (const p3 of adjacent2) {
                // Check if p3 is also adjacent to p1 (forms a triangle)
                if (isAdjacent(p1, p3) && !isSamePeg(p1, p3) && !isSamePeg(p2, p3)) {
                    // Normalize triangle (sort vertices) to avoid duplicates
                    const triangle = [p1, p2, p3].sort((a, b) => {
                        if (a.q !== b.q) return a.q - b.q
                        return a.r - b.r
                    })

                    const key = `${triangle[0].q},${triangle[0].r}|${triangle[1].q},${triangle[1].r}|${triangle[2].q},${triangle[2].r}`

                    if (!seen.has(key)) {
                        seen.add(key)
                        triangles.push(triangle as [AxialCoord, AxialCoord, AxialCoord])
                    }
                }
            }
        }
    }

    return triangles
}

/**
 * Checks if a line exists between two pegs (bidirectional).
 *
 * IMPORTANT: A game line goes through 4 pegs (distance = 3).
 * For triangle detection, we need to check if an EDGE between adjacent pegs
 * exists as part of any game line.
 *
 * Example: Line (0,0)-(3,0) contains edges:
 * - (0,0)-(1,0), (1,0)-(2,0), (2,0)-(3,0) (and reverse directions)
 *
 * So hasLine([(0,0)-(3,0)], (0,0), (1,0)) should return TRUE.
 */
export const hasLine = (lines: Line[], p1: AxialCoord, p2: AxialCoord): boolean => {
    return lines.some(line => {
        // First check: exact match (p1-p2 or p2-p1)
        if ((line.start.q === p1.q && line.start.r === p1.r && line.end.q === p2.q && line.end.r === p2.r) ||
            (line.start.q === p2.q && line.start.r === p2.r && line.end.q === p1.q && line.end.r === p1.r)) {
            return true;
        }

        // Second check: edge is part of a longer line
        // Check if both p1 and p2 lie on the line segment
        return arePegsOnLine(p1, p2, line);
    });
}

/**
 * Checks if two pegs both lie on a line segment (between start and end).
 * This handles the case where a game line goes through 4 pegs but we're
 * checking for an edge between adjacent pegs.
 */
const arePegsOnLine = (p1: AxialCoord, p2: AxialCoord, line: Line): boolean => {
    // Check if both p1 and p2 are collinear with line.start and line.end
    if (!areCollinear(line.start, line.end, p1) || !areCollinear(line.start, line.end, p2)) {
        return false;
    }

    // Check if both p1 and p2 lie between or at the endpoints of the line segment
    const p1Between = isBetweenOrAt(p1, line.start, line.end);
    const p2Between = isBetweenOrAt(p2, line.start, line.end);

    return p1Between && p2Between;
}

/**
 * Checks if three points are collinear in axial coordinates.
 */
const areCollinear = (a: AxialCoord, b: AxialCoord, c: AxialCoord): boolean => {
    // In axial coordinates, three points are collinear if the cross product is zero
    // Cross product in 2D: (b-a) x (c-a) = 0
    const ab_q = b.q - a.q;
    const ab_r = b.r - a.r;
    const ac_q = c.q - a.q;
    const ac_r = c.r - a.r;

    // Cross product: ab_q * ac_r - ab_r * ac_q
    return ab_q * ac_r - ab_r * ac_q === 0;
}

/**
 * Checks if point p lies between or at the endpoints of segment ab.
 */
const isBetweenOrAt = (p: AxialCoord, a: AxialCoord, b: AxialCoord): boolean => {
    // Check if p is on the segment from a to b (inclusive)
    // Using dot product to check if p is between a and b

    // Vector from a to b
    const ab_q = b.q - a.q;
    const ab_r = b.r - a.r;

    // Vector from a to p
    const ap_q = p.q - a.q;
    const ap_r = p.r - a.r;

    // Check if p is collinear with a and b (already checked by areCollinear)
    // Now just need to check if p is between a and b (inclusive)

    // Using the fact that if p is between a and b, then:
    // 0 <= (ap · ab) / (ab · ab) <= 1

    const dotProduct = ap_q * ab_q + ap_r * ab_r;
    const lengthSquared = ab_q * ab_q + ab_r * ab_r;

    if (lengthSquared === 0) return false; // a and b are the same point

    const t = dotProduct / lengthSquared;

    return t >= 0 && t <= 1;
}

/**
 * Detects new triangles formed after adding a line.
 * Returns triangles that have all 3 edges in the lines array.
 */
export const detectNewTriangles = (
    lines: Line[],
    currentPlayer: 'player1' | 'player2',
    validTriangles: AxialCoord[][]
): Triangle[] => {
    const newTriangles: Triangle[] = []

    for (const vertices of validTriangles) {
        const [v1, v2, v3] = vertices

        // Check if all 3 edges exist
        if (hasLine(lines, v1, v2) && hasLine(lines, v2, v3) && hasLine(lines, v3, v1)) {
            newTriangles.push({
                vertices: [v1, v2, v3],
                player: currentPlayer
            })
        }
    }

    return newTriangles
}

// Helper functions

const getAdjacentPegs = (peg: AxialCoord, allPegs: AxialCoord[]): AxialCoord[] => {
    return allPegs.filter(p => isAdjacent(peg, p) && !isSamePeg(peg, p))
}

const isAdjacent = (p1: AxialCoord, p2: AxialCoord): boolean => {
    const dq = Math.abs(p1.q - p2.q)
    const dr = Math.abs(p1.r - p2.r)
    const ds = Math.abs((-p1.q - p1.r) - (-p2.q - p2.r))
    const distance = Math.max(dq, dr, ds)
    return distance === 1
}

const isSamePeg = (p1: AxialCoord, p2: AxialCoord): boolean => {
    return p1.q === p2.q && p1.r === p2.r
}

// Pre-generate valid triangles for radius 3 grid (module-level constant)
export const VALID_TRIANGLES = generateValidTriangles(3)
