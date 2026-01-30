import { describe, it, expect } from 'vitest'
import { generateValidTriangles, hasLine, detectNewTriangles, VALID_TRIANGLES, Line } from './triangle-detector'

describe('triangle-detector', () => {
    describe('generateValidTriangles', () => {
        it('should generate triangles for radius 1 grid', () => {
            const triangles = generateValidTriangles(1)
            // Radius 1 grid has 7 pegs, should have 6 size-1 triangles
            expect(triangles.length).toBeGreaterThan(0)
        })

        it('should generate triangles for radius 3 grid', () => {
            const triangles = generateValidTriangles(3)
            // Radius 3 grid should have many size-1 triangles
            expect(triangles.length).toBeGreaterThan(20)
        })

        it('should have all vertices adjacent in each triangle', () => {
            const triangles = generateValidTriangles(2)

            for (const triangle of triangles) {
                const [v1, v2, v3] = triangle

                // Check distance between each pair
                const dist12 = Math.max(
                    Math.abs(v1.q - v2.q),
                    Math.abs(v1.r - v2.r),
                    Math.abs((-v1.q - v1.r) - (-v2.q - v2.r))
                )
                const dist23 = Math.max(
                    Math.abs(v2.q - v3.q),
                    Math.abs(v2.r - v3.r),
                    Math.abs((-v2.q - v2.r) - (-v3.q - v3.r))
                )
                const dist31 = Math.max(
                    Math.abs(v3.q - v1.q),
                    Math.abs(v3.r - v1.r),
                    Math.abs((-v3.q - v3.r) - (-v1.q - v1.r))
                )

                expect(dist12).toBe(1)
                expect(dist23).toBe(1)
                expect(dist31).toBe(1)
            }
        })

        it('should not have duplicate triangles', () => {
            const triangles = generateValidTriangles(2)
            const seen = new Set<string>()

            for (const triangle of triangles) {
                const key = `${triangle[0].q},${triangle[0].r}|${triangle[1].q},${triangle[1].r}|${triangle[2].q},${triangle[2].r}`
                expect(seen.has(key)).toBe(false)
                seen.add(key)
            }
        })
    })

    describe('hasLine', () => {
        it('should return true for existing line (forward direction)', () => {
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } }
            ]
            expect(hasLine(lines, { q: 0, r: 0 }, { q: 1, r: 0 })).toBe(true)
        })

        it('should return true for existing line (reverse direction)', () => {
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } }
            ]
            expect(hasLine(lines, { q: 1, r: 0 }, { q: 0, r: 0 })).toBe(true)
        })

        it('should return false for non-existing line', () => {
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } }
            ]
            expect(hasLine(lines, { q: 0, r: 0 }, { q: 0, r: 1 })).toBe(false)
        })
    })

    describe('detectNewTriangles', () => {
        it('should detect a complete triangle', () => {
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } },
                { start: { q: 1, r: 0 }, end: { q: 0, r: 1 } },
                { start: { q: 0, r: 1 }, end: { q: 0, r: 0 } }
            ]

            const validTriangles = [
                [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }]
            ]

            const triangles = detectNewTriangles(lines, 'player1', validTriangles)
            expect(triangles.length).toBe(1)
            expect(triangles[0].player).toBe('player1')
        })

        it('should not detect incomplete triangle', () => {
            const lines: Line[] = [
                { start: { q: 0, r: 0 }, end: { q: 1, r: 0 } },
                { start: { q: 1, r: 0 }, end: { q: 0, r: 1 } }
                // Missing third edge
            ]

            const validTriangles = [
                [{ q: 0, r: 0 }, { q: 0, r: 1 }, { q: 1, r: 0 }]
            ]

            const triangles = detectNewTriangles(lines, 'player1', validTriangles)
            expect(triangles.length).toBe(0)
        })
    })

    describe('VALID_TRIANGLES', () => {
        it('should be pre-generated for radius 3', () => {
            expect(VALID_TRIANGLES.length).toBeGreaterThan(0)
        })
    })
})
