# Test: axialDistance function

```typescript
describe('axialDistance', () => {
    it('should calculate distance 0 for same peg', () => {
        expect(axialDistance(0, 0, 0, 0)).toBe(0)
    })

    it('should calculate distance 1 for adjacent pegs', () => {
        expect(axialDistance(0, 0, 1, 0)).toBe(1)
        expect(axialDistance(0, 0, 0, 1)).toBe(1)
    })

    it('should calculate distance 3 for pegs 3 steps apart', () => {
        expect(axialDistance(0, 0, 3, 0)).toBe(3)
        expect(axialDistance(0, 0, 0, 3)).toBe(3)
    })

    it('should calculate correct distance for diagonal movement', () => {
        // From (0,0) to (2,1) should be distance 3
        expect(axialDistance(0, 0, 2, 1)).toBe(3)
    })
})
```

Add this test suite to `grid-utils.test.ts` before the closing `})`.
