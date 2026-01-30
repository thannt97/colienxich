# Story 1.3: Điều khiển trò chơi và Hiệu ứng phản hồi

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Người chơi,
I want có thể chơi lại từ đầu và nhận được phản hồi rung khi thao tác,
so that tôi chủ động trong việc bắt đầu trận đấu mới và cảm thấy tương tác sống động hơn.

## Acceptance Criteria

1. Cung cấp nút "Reset Game" dễ thấy trên giao diện Dashboard hoặc Game Stage. [Source: epics.md#Story 1.3] [x]
2. Khi nhấn "Reset Game", toàn bộ trạng thái (Score, Turn, Bàn cờ) quay về giá trị khởi tạo. [Source: epics.md#Story 1.3] [x]
3. Thiết bị di động phản hồi rung (Haptic Feedback) khi thực hiện hành động kéo dây hoặc ghi điểm. [Source: prd.md#FR-UI-04] [x]
4. Hiển thị hiệu ứng chuyển cảnh mượt mà khi reset để người chơi biết game đã bắt đầu lại. [Source: prd.md#Journey Requirements Summary] [x]

## Tasks / Subtasks

- [x] Triển khai Logic Reset trong Game Store
  - [x] Đảm bảo action `resetGame` trong `game-store.ts` xóa sạch các mảng lưu trữ dây và tam giác (sẽ được dùng ở các story sau).
  - [x] Reset điểm số về 0 và lượt đi về 'player'.
- [x] Bổ sung Nút Reset vào Dashboard
  - [x] Cập nhật `src/features/game/components/Dashboard.tsx` để thêm nút Reset.
  - [x] Apply style sang trọng cho nút (Modern UI, hover effects).
- [x] Xây dựng Haptic Service
  - [x] Tạo module `src/shared/utils/haptic.ts` để bọc `window.navigator.vibrate`.
  - [x] Kiểm tra tính khả dụng của API trước khi gọi (đảm bảo không lỗi trên browser không hỗ trợ).
- [x] Tích hợp Haptic vào Game
  - [x] Gọi Haptic feedback khi người chơi bắt đầu nhấn vào trụ (peg).
  - [x] Gọi Haptic feedback khi resetting game (optional but recommended for flair).
- [x] Thêm hiệu ứng visual khi Reset
  - [x] Sử dụng CSS transitions hoặc animations đơn giản (như fade out/in toàn bộ Stage) khi reset.

## Dev Notes

- **Haptic API**: Sử dụng `navigator.vibrate(pattern)`. Chú ý pattern ngắn (10-20ms) cho cảm giác haptic hiện đại. [Source: MDN Web Docs]
- **State Cleanup**: Khi reset, sử dụng `resetCounter` trong store để trigger re-render và animation cho `StageContainer`.
- **Styling**: Nút Reset được tích hợp vào `vs-container` trong Dashboard, sử dụng animation rotate khi hover.

### Project Structure Notes

- **Utils Location**: `src/shared/utils/haptic.ts`
- **Dashboard Update**: `src/features/game/components/Dashboard.tsx`
- **Visual Animation**: `src/features/game/components/StageContainer.css`

### References

- [PRD: UI & Feedback #FR-UI-03, #FR-UI-04](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/prd.md#L165-166)
- [Architecture: Process Patterns - Audio/Haptics](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/architecture.md#L43)

## Dev Agent Record

### Agent Model Used

Antigravity (Amelia persona)

### Debug Log References

- [game-store.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.test.ts): Verified reset logic.

### Completion Notes List

- ✅ Haptic utility implemented with vibration safety checks.
- ✅ Reset button added to Dashboard with modern styling and SVG icon.
- ✅ Integrated haptic feedback into peg interaction and reset action.
- ✅ Added fadeIn animation when game resets via `resetCounter` key.

### File List

- [src/shared/utils/haptic.ts](file:///home/thannv/workspace/cpx-qlnd/src/shared/utils/haptic.ts)
- [src/features/game/store/game-store.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.ts)
- [src/features/game/components/Dashboard.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/Dashboard.tsx)
- [src/features/game/components/Dashboard.css](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/Dashboard.css)
- [src/features/game/components/StaticLayer.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/StaticLayer.tsx)
- [src/features/game/components/StageContainer.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/StageContainer.tsx)
- [src/features/game/components/StageContainer.css](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/StageContainer.css)
