export interface AxialCoord {
    q: number
    r: number
}

export const HEX_LAYOUT = {
    size: 30, // Default size (distance from center to corner)
}

/**
 * Converts axial coordinates (q, r) to pixel coordinates (x, y)
 * for a pointy-topped hexagonal grid.
 */
export const axialToPixel = (q: number, r: number, size: number = HEX_LAYOUT.size) => {
    const x = size * Math.sqrt(3) * (q + r / 2)
    const y = size * (3 / 2) * r
    return { x, y }
}

/**
 * Converts pixel coordinates (x, y) to fractional axial coordinates (q, r)
 * for a pointy-topped hexagonal grid.
 */
export const pixelToAxial = (x: number, y: number, size: number = HEX_LAYOUT.size) => {
    const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / size
    const r = (2 / 3 * y) / size
    return { q, r }
}

/**
 * Rounds fractional axial coordinates to the nearest integer axial coordinates.
 */
export const roundAxial = (q: number, r: number) => {
    let rq = Math.round(q)
    let rr = Math.round(r)
    let rs = Math.round(-q - r)

    const dq = Math.abs(rq - q)
    const dr = Math.abs(rr - r)
    const ds = Math.abs(rs - (-q - r))

    if (dq > dr && dq > ds) {
        rq = -rr - rs
    } else if (dr > ds) {
        rr = -rq - rs
    }

    return { q: rq, r: rr }
}

/**
 * Calculates the distance between two axial coordinates.
 * In hexagonal grids, distance is the maximum of the absolute differences
 * of the three cube coordinates (q, r, s where s = -q - r).
 */
export const axialDistance = (q1: number, r1: number, q2: number, r2: number) => {
    const dq = Math.abs(q1 - q2)
    const dr = Math.abs(r1 - r2)
    const ds = Math.abs((-q1 - r1) - (-q2 - r2))
    return Math.max(dq, dr, ds)
}

/**
 * Validates if a line between two pegs is straight and passes through exactly 4 pegs.
 * In hexagonal grids, a straight line means moving in one of 6 directions consistently.
 * The line must have distance = 3 (4 pegs total: start + 2 middle + end).
 */
export const isValidStraightLine = (q1: number, r1: number, q2: number, r2: number) => {
    const distance = axialDistance(q1, r1, q2, r2)

    // Must be exactly distance 3 (4 pegs: start, middle1, middle2, end)
    if (distance !== 3) {
        return false
    }

    // Check if it's a straight line in one of the 6 hex directions
    // In axial coordinates, straight lines have one of these patterns:
    // 1. q changes, r constant (horizontal-ish)
    // 2. r changes, q constant (vertical-ish)
    // 3. q and r change by same amount (diagonal)
    const dq = q2 - q1
    const dr = r2 - r1
    const ds = (-q2 - r2) - (-q1 - r1)

    // One of the three cube coordinates must be constant (= 0 change)
    return dq === 0 || dr === 0 || ds === 0
}

/**
 * Generates the coordinates for a hexagonal board with a given radius.
 * The center peg is at (0, 0).
 */
export const generateHexGrid = (radius: number): AxialCoord[] => {
    const pegs: AxialCoord[] = []
    for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius)
        const r2 = Math.min(radius, -q + radius)
        for (let r = r1; r <= r2; r++) {
            pegs.push({ q, r })
        }
    }
    return pegs
}
