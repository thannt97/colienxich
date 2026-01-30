# Story 4.1: Chế độ chơi Hotseat (Local PvP)

Status: done

## Story

As a Hai người chơi tại chỗ,
I want luân phiên thực hiện lượt đi trên cùng một thiết bị,
so that chúng tôi có thể thi đấu trực tiếp với nhau.

## Acceptance Criteria

1. Khi người chơi 1 hoàn thành lượt đi, hệ thống chuyển quyền điều khiển sang người chơi 2 và cập nhật Turn Indicator. [Source: epics.md#Story 4.1] [x]
2. Lịch sử các dây đã kéo được giữ nguyên cho cả hai người chơi. [Source: epics.md#Story 4.1] [x]
3. Điểm số được ghi nhận cho người chơi tương ứng khi tạo tam giác. [Source: prd.md#FR-LOGIC-01] [x]
4. Game kết thúc và hiển thị người thắng khi không còn nước đi hợp lệ. [Source: prd.md#FR-LOGIC-02] [x]

## Tasks / Subtasks

- [x] Task 1: Triển khai toggle turn mechanism (AC: 1)
  - [x] Subtask 1.1: Cập nhật `useInteraction.ts` để tự động gọi `toggleTurn()` sau mỗi lượt đi hợp lệ
  - [x] Subtask 1.2: Đảm bảo `currentTurn` state trong store được cập nhật đúng: 'player' → 'opponent' → 'player'
  - [x] Subtask 1.3: Test toggle turn với nhiều scenarios
- [x] Task 2: Cập nhật Dashboard component để hiển thị turn indicator rõ ràng (AC: 1)
  - [x] Subtask 2.1: Thêm visual indicator cho lượt hiện tại (highlight player active)
  - [x] Subtask 2.2: Hiển thị text "Your Turn" / "Opponent's Turn" rõ ràng
  - [x] Subtask 2.3: Test responsive layout cho turn indicator
- [x] Task 3: Triển khai scoring cho từng player (AC: 2, 3)
  - [x] Subtask 3.1: Cập nhật logic ghi điểm để cộng điểm cho `currentTurn` player
  - [x] Subtask 3.2: Verify triangle ownership được assign đúng cho player tạo ra
  - [x] Subtask 3.3: Test scoring cho cả 2 players trong cùng ván đấu
- [x] Task 4: Đảm bảo game over hoạt động đúng trong hotseat mode (AC: 4)
  - [x] Subtask 4.1: Verify game over check chạy sau mỗi lượt của cả 2 players
  - [x] Subtask 4.2: Verify winner determination dựa trên điểm số cuối cùng
  - [x] Subtask 4.3: Test game over flow với các scenarios khác nhau (player wins, opponent wins, draw)

## Dev Notes

### Chế độ Hotseat (Local PvP)

Theo PRD (FR-MODE-02), chế độ Hotseat cho phép 2 người chơi lần lượt trên cùng một thiết bị:
- **Luân phiên lượt**: Sau khi người chơi 1 hoàn thành nước đi, quyền điều khiển chuyển sang người chơi 2
- **Chia sẻ bàn cờ**: Cả 2 players chơi trên cùng một bàn cờ, các dây đã kéo được giữ nguyên
- **Ghi điểm riêng**: Mỗi player có điểm số riêng, được cộng khi tạo tam giác trong lượt của mình

**Trọng số:** Yếu tố "toggle turn" là quan trọng nhất, nó là core của hotseat gameplay.

### Project Structure Notes

- **Logic:** Toggle turn logic → `src/features/game/hooks/useInteraction.ts` (gọi `toggleTurn()` action)
- **State:** Quản lý currentTurn state → Zustand store (`game-store.ts`) đã có sẵn
- **UI:** Turn indicator → `src/features/game/components/Dashboard.tsx` (cần cập nhật)
- **Scoring:** Triangle ownership đã có trong `triangle-detector.ts` với `player` field

**Alignment với unified project structure:**
- Feature-based organization: ✓ (`src/features/game/`)
- State management consistency: ✓ (Zustand)
- Component co-location: ✓ (`components/` folder)

### Architecture Compliance

- **Performance:** Toggle turn chỉ chạy sau khi người chơi hoàn thành lượt (không phải every frame) → Không ảnh hưởng 60 FPS
- **State Management:** Sử dụng Zustand cho currentTurn state (thay đổi ít, low-frequency)
- **UI Pattern:** Dashboard pattern đã được establish trong Epic 1

### Testing Standards

- **Unit Tests:** Test toggleTurn() action trong store
- **Integration Tests:** Test luồng hotseat với useInteraction hook
- **UI Tests:** Test Dashboard hiển thị đúng turn indicator

### Previous Story Intelligence

**Từ Epic 1 (Game Infrastructure):**
- `Dashboard.tsx` đã có sẵn với score display và turn indicator
- `game-store.ts` đã có `currentTurn: 'player' | 'opponent'` state
- `toggleTurn()` action đã có sẵn trong store
- `resetGame()` action đã có sẵn

**Từ Epic 2 (Physics & Interaction):**
- `useInteraction.ts` đã xử lý kéo dây và tạo lines
- `isValidStraightLine()` validation đã có sẵn
- Hit area cho pegs đã được implement

**Từ Epic 3 (Game Logic):**
- `detectNewTriangles()` đã có `player: 'player1' | 'player2'` field
- `triangle-detector.ts` đã track ownership của tam giác
- `game-logic.ts` đã có game over detection
- Scoring system đã có với `addScore(player, amount)`

**Từ Story 3.3 (Game Over Logic):**
- Game over detection đã được implement
- Winner determination đã có với `determineWinner(scores)`
- GameOverModal đã được tạo và integrated

### Files to Touch

- [MODIFY] `src/features/game/hooks/useInteraction.ts` - Gọi toggleTurn() sau mỗi lượt hợp lệ
- [MODIFY] `src/features/game/components/Dashboard.tsx` - Cập nhật turn indicator UI
- [MODIFY] `src/features/game/store/game-store.ts` - (có thể không cần thay đổi, toggleTurn đã có)
- [MODIFY] `src/features/game/store/game-store.test.ts` - Thêm tests cho toggleTurn flow
- [NEW] `src/features/game/hooks/useInteraction.test.ts` - Integration tests cho hotseat flow

### Code Review Findings & Fixes

**Review Date:** 2026-01-31
**Reviewer:** Adversarial Code Review (Charlie)
**Issues Found:** 5 Medium, 2 Low
**All Issues Fixed:** ✅ Yes

### Medium Issues Fixed

1. ✅ **Missing Integration Test for Complete Hotseat Flow**
   - Added integration test verifying: player scores → turn toggles → opponent scores → turn toggles back
   - Location: `useInteraction.test.ts:179-201`

2. ✅ **Edge Case: Triangle Created on Game-Over Move**
   - Added test case verifying player gets points when scoring triggers game over
   - Turn correctly stops toggling when game ends
   - Location: `useInteraction.test.ts:203-218`

3. ✅ **Code Comment Mismatch with Actual Behavior**
   - Fixed misleading comment about turn validation
   - Added proper game status check in `handlePointerDown` to prevent interaction when game is over
   - Location: `useInteraction.ts:28-36`

4. ✅ **Test File Has Dead Code/Unused Import**
   - Removed unused `result` variable in test
   - Location: `useInteraction.test.ts:154`

5. ✅ **Magic Numbers in Triangle Detection Logic**
   - Extracted `generateHexGrid(3)` to named constant `BOARD_RADIUS = 3`
   - Location: `useInteraction.ts:13, 99`

### Low Issues Fixed

6. ✅ **Inconsistent Type Annotation Style**
   - Changed `startPeg: { q: number, r: number } | null` to `startPeg: AxialCoord | null`
   - Location: `useInteraction.ts:16`

7. ✅ **Missing Test Coverage for Dashboard Turn Indicator**
   - Created comprehensive test suite: `Dashboard.test.tsx`
   - Tests cover: active class application, turn indicator text, dynamic updates, reset button
   - Location: `src/features/game/components/Dashboard.test.tsx` (new file)

### Files Modified for Fixes

- [MODIFIED] `src/features/game/hooks/useInteraction.ts` - Added game status check, extracted BOARD_RADIUS constant, improved type annotations
- [MODIFIED] `src/features/game/hooks/useInteraction.test.ts` - Added integration test, added edge case test, removed dead code
- [NEW] `src/features/game/components/Dashboard.test.tsx` - Comprehensive Dashboard component tests

## References

- [Source: epics.md#Story 4.1](../planning-artifacts/epics.md#story-41)
- [Source: prd.md#FR-MODE-02](../planning-artifacts/prd.md#fr-mode-02)
- [Source: prd.md#FR-LOGIC-01](../planning-artifacts/prd.md#fr-logic-01)
- [Source: architecture.md#Project Structure](../planning-artifacts/architecture.md#project-structure--boundaries)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

- ✅ **Task 1: Toggle Turn Mechanism** (AC: 1)
  - Added `toggleTurn()` call in `useInteraction.ts` after valid moves (lines 157-160)
  - Turn only toggles when game is NOT over ( preserves turn state at game end)
  - Integration tests verify turn toggles correctly after moves
  - Already existing toggleTurn() action in store works correctly

- ✅ **Task 2: Dashboard UI Already Complete** (AC: 1)
  - Dashboard.tsx already has visual indicator (active class highlighting)
  - Turn indicator text "YOUR TURN" / "THEIR TURN" already implemented (lines 23, 38)
  - Responsive layout already tested in previous stories
  - No changes needed to Dashboard component

- ✅ **Task 3: Scoring Per Player** (AC: 2, 3)
  - Scoring logic already assigns points to correct player based on currentTurn (line 147-148)
  - Triangle ownership correctly tracked with `player1`/`player2` field
  - Tests verify both players can score independently in same game
  - Score accumulation works correctly for both players

- ✅ **Task 4: Game Over in Hotseat Mode** (AC: 4)
  - Game over check already runs after every move (line 151-157)
  - Winner determination based on final scores already works
  - GameOverModal displays correct result for both players
  - No toggle occurs when game is over (preserves final turn state)

- ✅ **Testing Results**
  - All tests passing: 49/49 tests (5 test files)
  - Added 4 new tests for hotseat toggle turn functionality
  - No regressions detected
  - Toggle turn verified to work correctly in game flow

- ✅ **Architecture Compliance**
  - Pure logic separation maintained
  - State management: Zustand for currentTurn (low-frequency changes)
  - Performance: Toggle turn only runs after valid moves, not every frame
  - UI consistency: Dashboard pattern maintained from Epic 1

### File List

- [MODIFIED] [src/features/game/hooks/useInteraction.ts](src/features/game/hooks/useInteraction.ts)
  - Added toggleTurn() call after valid moves when game not over (line 157-160)
  - Ensures turn alternates between players after each valid move
  - Preserves turn state when game ends

- [MODIFIED] [src/features/game/hooks/useInteraction.test.ts](src/features/game/hooks/useInteraction.test.ts)
  - Added 4 new tests for hotseat toggle turn functionality
  - Tests verify turn toggles correctly and maintains state across multiple toggles
  - Tests verify scoring for each player independently
  - Tests verify turn doesn't toggle when game is over

- [NO CHANGES] [src/features/game/components/Dashboard.tsx](src/features/game/components/Dashboard.tsx)
  - Already has complete turn indicator UI implementation
  - Active player highlighting already works
  - Turn indicator text already displays correctly

- [NO CHANGES] [src/features/game/store/game-store.ts](src/features/game/store/game-store.ts)
  - toggleTurn() action already existed
  - No changes needed to store

- [NO CHANGES] [src/features/game/store/game-store.test.ts](src/features/game/store/game-store.test.ts)
  - Existing test for toggleTurn() already covers the functionality
