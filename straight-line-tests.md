// Add these tests to grid-utils.test.ts

describe('isValidStraightLine', () => {
    it('should accept straight horizontal line with distance 3', () => {
        // (0,0) to (3,0) - straight line along q axis
        expect(isValidStraightLine(0, 0, 3, 0)).toBe(true)
    })

    it('should accept straight vertical line with distance 3', () => {
        // (0,0) to (0,3) - straight line along r axis
        expect(isValidStraightLine(0, 0, 0, 3)).toBe(true)
    })

    it('should accept straight diagonal line with distance 3', () => {
        // (0,0) to (-3,3) - straight diagonal (s constant)
        expect(isValidStraightLine(0, 0, -3, 3)).toBe(true)
    })

    it('should reject line with distance < 3', () => {
        // (0,0) to (2,0) - only 3 pegs, not 4
        expect(isValidStraightLine(0, 0, 2, 0)).toBe(false)
    })

    it('should reject line with distance > 3', () => {
        // (0,0) to (4,0) - 5 pegs, not 4
        expect(isValidStraightLine(0, 0, 4, 0)).toBe(false)
    })

    it('should reject non-straight line', () => {
        // (0,0) to (2,1) - not a straight line in hex grid
        expect(isValidStraightLine(0, 0, 2, 1)).toBe(false)
    })
})
