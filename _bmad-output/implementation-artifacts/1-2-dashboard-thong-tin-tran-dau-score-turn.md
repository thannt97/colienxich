# Story 1.2: Dashboard thông tin trận đấu (Score & Turn)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Người chơi,
I want biết số điểm hiện tại và lượt đi đang thuộc về ai,
so that tôi có thể theo dõi tiến trình trận đấu và đưa ra chiến lược phù hợp.

## Acceptance Criteria

1. Dashboard hiển thị rõ ràng điểm số của Player và Opponent (FR11). [Source: epics.md#Story 1.2] [x]
2. Chỉ báo lượt đi (Turn Indicator) hiển thị đúng người chơi đang thực hiện lượt (FR9). [Source: epics.md#Story 1.2] [x]
3. Dữ liệu điểm số và lượt đi được đồng bộ từ Zustand store (UI State). [Source: architecture.md#State Management] [x]
4. Giao diện Dashboard hiển thị tốt trên cả thiết bị di động và máy tính (Responsive). [Source: prd.md#Non-Functional Requirements] [x]

## Tasks / Subtasks

- [x] Thiết lập Global State cho Game bằng Zustand
  - [x] Tạo file `src/features/game/store/game-store.ts`
  - [x] Khai báo state: `score: { player: number, opponent: number }`, `currentTurn: 'player' | 'opponent'`, `gameStatus: 'active' | 'gameOver' | 'paused'`
  - [x] Khai báo actions: `addScore(player: 'player' | 'opponent', amount: number)`, `toggleTurn()`, `resetGame()`
- [x] Xây dựng Component Dashboard
  - [x] Tạo file `src/features/game/components/Dashboard.tsx`
  - [x] Hiển thị điểm số hai bên một cách trực quan, sang trọng (vibrant colors, modern typography).
  - [x] Hiển thị chỉ báo "Your Turn" hoặc "Opponent's Turn" với hiệu ứng nhấn mạnh (như gradient hoặc animation nhẹ).
- [x] Tích hợp Dashboard vào Layout chính
  - [x] Cập nhật `src/App.tsx` để hiển thị Dashboard phía trên hoặc xung quanh khu vực bàn cờ.
  - [x] Đảm bảo Dashboard không che khuất khu vực chơi game (Game Stage).
- [x] Unit Test cho Game Store
  - [x] Tạo file `src/features/game/store/game-store.test.ts`
  - [x] Kiểm tra các action `addScore`, `toggleTurn`, `resetGame` hoạt động đúng logic.

## Dev Notes

- **State Sync**: Zustand store chỉ dùng cho UI State. Dữ liệu physics vẫn nằm trong refs/mutable state như quy định tại [architecture.md:L86-88](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/architecture.md#L86-88).
- **Styling**: Sử dụng Vanilla CSS trong `src/App.css` hoặc tạo file CSS riêng cho Dashboard. Ưu tiên phong cách modern, premium (glassmorphism/subtle gradients).
- **Responsive**: Sử dụng Flexbox để Dashboard thích ứng với màn hình dọc (Mobile) và ngang (Desktop).

### Project Structure Notes

- **Store Location**: `src/features/game/store/game-store.ts`
- **Component Location**: `src/features/game/components/Dashboard.tsx`

### References

- [PRD: Functional Requirements #FR11](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/prd.md#L26)
- [Architecture: State Management Patterns](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/architecture.md#L85-88)
- [Architecture: Project Directory Structure](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/architecture.md#L131)

## Dev Agent Record

### Agent Model Used

Antigravity (Amelia persona)

### Debug Log References

- [game-store.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.test.ts): Verified store actions and state transitions.

### Completion Notes List

- ✅ Zustand store implemented for UI state management.
- ✅ `Dashboard` component created with responsive design and glassmorphism styling.
- ✅ Integrated `Dashboard` into `App.tsx`.
- ✅ Unit tests passing for `game-store`.

### File List

- [src/features/game/store/game-store.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.ts)
- [src/features/game/store/game-store.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.test.ts)
- [src/features/game/components/Dashboard.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/Dashboard.tsx)
- [src/features/game/components/Dashboard.css](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/Dashboard.css)
- [src/App.tsx](file:///home/thannv/workspace/cpx-qlnd/src/App.tsx)
