import { describe, it, expect } from 'vitest'
import { axialToPixel, generateHexGrid, HEX_LAYOUT, pixelToAxial, roundAxial, axialDistance, isValidStraightLine } from './grid-utils'

describe('grid-utils', () => {
    describe('axialToPixel', () => {
        it('should convert center (0,0) to (0,0)', () => {
            const { x, y } = axialToPixel(0, 0)
            expect(x).toBeCloseTo(0)
            expect(y).toBeCloseTo(0)
        })

        it('should convert axial (1,0) correctly based on size', () => {
            const { x, y } = axialToPixel(1, 0)
            // For pointy-topped hex: x = size * sqrt(3) * (q + r/2), y = size * 3/2 * r
            const expectedX = HEX_LAYOUT.size * Math.sqrt(3)
            const expectedY = 0
            expect(x).toBeCloseTo(expectedX)
            expect(y).toBeCloseTo(expectedY)
        })

        it('should convert axial (0,1) correctly based on size', () => {
            const { x, y } = axialToPixel(0, 1)
            const expectedX = HEX_LAYOUT.size * Math.sqrt(3) / 2
            const expectedY = HEX_LAYOUT.size * 3 / 2
            expect(x).toBeCloseTo(expectedX)
            expect(y).toBeCloseTo(expectedY)
        })
    })
    describe('generateHexGrid', () => {
        it('should generate 1 peg for radius 0', () => {
            const pegs = generateHexGrid(0)
            expect(pegs.length).toBe(1)
            expect(pegs[0].q).toBeCloseTo(0)
            expect(pegs[0].r).toBeCloseTo(0)
        })

        it('should generate 7 pegs for radius 1', () => {
            const pegs = generateHexGrid(1)
            expect(pegs.length).toBe(7)
        })

        it('should generate 37 pegs for radius 3', () => {
            const pegs = generateHexGrid(3)
            expect(pegs.length).toBe(37)
        })
    })
})
