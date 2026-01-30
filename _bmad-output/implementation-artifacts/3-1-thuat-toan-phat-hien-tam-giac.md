# User Story 3.1: Thuật toán Phát hiện tam giác (Triangle Detection)

Status: done

## Story

As a Hệ thống,
I want tự động phát hiện khi các dây chun tạo thành một hình tam giác kín khít,
so that tôi có thể xác định khi nào người chơi ghi được điểm.

## Acceptance Criteria

1. Sau mỗi lần tạo dây mới, hệ thống phải chạy thuật toán triangle detection. [Source: epics.md#Story 3.1] [ ]
2. Hệ thống chỉ phát hiện tam giác có cạnh bằng 1 (3 trụ kề nhau tạo thành tam giác nhỏ nhất). [Source: prd.md#FR-GAME-05] [ ]
3. Tam giác lớn hơn hoặc tam giác lồng nhau phải bị bỏ qua. [Source: prd.md#FR-GAME-05] [ ]
4. Thuật toán phải đảm bảo tính nhất quán trên mọi thiết bị (deterministic). [Source: epics.md#NFR91] [ ]

## Technical Requirements

### Algorithm Design

**Approach:** Pre-generate all valid size-1 triangle coordinates for radius-3 hex grid, then check if all 3 edges exist in `lines` array.

**Why this approach:**
- **Performance:** O(T × L) where T = number of possible triangles (~60), L = number of lines (~30 max). Very fast.
- **Deterministic:** No floating-point math, pure coordinate comparison.
- **Simple:** Easy to test and maintain.

### Data Structures

```typescript
// Triangle representation
interface Triangle {
    vertices: [AxialCoord, AxialCoord, AxialCoord];
    player: 'player1' | 'player2';
}

// Valid size-1 triangles (pre-generated)
const VALID_TRIANGLES: AxialCoord[][] = [
    // All possible size-1 triangles on radius-3 grid
    // Generated once at module load
];
```

### Implementation Steps

1. **Create `triangle-detector.ts`** in `src/features/game/logic/`
   - `generateValidTriangles(radius: number)`: Pre-generate all size-1 triangle coordinates
   - `hasLine(lines, p1, p2)`: Check if a line exists between two pegs (bidirectional)
   - `detectNewTriangles(lines, lastLine, currentPlayer)`: Find triangles formed by the last line

2. **Update `game-store.ts`**
   - Add `triangles: Triangle[]` to state
   - Add `addTriangle(triangle: Triangle)` action
   - Call `detectNewTriangles` after `addLine`

3. **Integration**
   - Hook triangle detection into `useInteraction.ts` after successful line creation
   - Store detected triangles with player ownership

## Developer Context

- **Previous Work:**
  - Epic 2 established robust hex grid math in `grid-utils.ts`
  - `lines` array structure: `{ start: { q, r }, end: { q, r } }`
  - `axialDistance` function available for validation

- **Architecture Compliance:**
  - Triangle detection is pure logic → belongs in `logic/` folder
  - State management → Zustand store
  - No UI rendering in this story (that's Story 3.2)

- **Performance:**
  - Pre-generate triangles once (module-level constant)
  - Detection runs only after line creation (not every frame)
  - Expected complexity: O(60 × 30) = O(1800) operations max → negligible

## Dev Notes

### Size-1 Triangle Definition

In hex grid, a size-1 triangle has:
- 3 vertices that are all adjacent (distance = 1 from each other)
- All 3 edges must exist in `lines` array
- Example: vertices at (0,0), (1,0), (0,1) form a size-1 triangle

### Generating Valid Triangles

```typescript
// Pseudo-code
for each peg P1 on grid:
    for each adjacent peg P2:
        for each peg P3 adjacent to both P1 and P2:
            if (P1, P2, P3) form a triangle:
                add to VALID_TRIANGLES
```

### Edge Case: Duplicate Triangles

- Same triangle can be detected multiple times (different edge order)
- Solution: Normalize triangle vertices (sort by q, then r) before adding to state
- Check for duplicates before adding

## Files to Create/Modify

- [NEW] `src/features/game/logic/triangle-detector.ts`
- [NEW] `src/features/game/logic/triangle-detector.test.ts`
- [MODIFY] `src/features/game/store/game-store.ts`
- [MODIFY] `src/features/game/store/game-store.test.ts`
- [MODIFY] `src/features/game/hooks/useInteraction.ts`

## Completion Checklist (for Dev Agent)

- [x] Create `triangle-detector.ts` with core functions
- [x] Implement `generateValidTriangles` function
- [x] Implement `hasLine` helper function
- [x] Implement `detectNewTriangles` function
- [x] Add comprehensive unit tests for triangle detection
- [x] Update `game-store.ts` with `triangles` state and `addTriangle` action
- [x] Integrate triangle detection into `useInteraction.ts`
- [x] Verify no duplicate triangles are created
- [x] Test with various line configurations

## Completion Notes

- ✅ Created `triangle-detector.ts` with pre-generated valid triangles (VALID_TRIANGLES constant)
- ✅ Implemented efficient triangle detection algorithm (O(T × L) where T ≈ 60, L ≈ 30)
- ✅ Added `AxialCoord` type export to `grid-utils.ts`
- ✅ Updated `game-store.ts` with `triangles` state and `addTriangle` action
- ✅ Integrated detection into `useInteraction.ts` - runs after each line creation
- ✅ Duplicate triangle prevention implemented
- ✅ All unit tests passing (10/10 for triangle-detector, 5/5 for store, 4/4 for interaction)
- ✅ Triangle detection is deterministic and consistent across devices

## Files Created/Modified

- [NEW] [src/features/game/logic/triangle-detector.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/triangle-detector.ts)
- [NEW] [src/features/game/logic/triangle-detector.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/triangle-detector.test.ts)
- [MODIFIED] [src/features/game/logic/grid-utils.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/grid-utils.ts)
- [MODIFIED] [src/features/game/store/game-store.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.ts)
- [MODIFIED] [src/features/game/hooks/useInteraction.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.ts)
