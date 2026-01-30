# Story 2.1: Cơ chế kéo dây đàn hồi (Elastic Dragging)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Người chơi,
I want kéo ngón tay/chuột từ một trụ để tạo thành một sợi dây chun co giãn theo tay mình,
so that tôi có thể nhắm đến trụ đích để thực hiện nước đi.

## Acceptance Criteria

1. Khi người chơi nhấn vào một trụ (peg) trong lượt của mình, hệ thống bắt đầu chế độ kéo dây. [Source: epics.md#Story 2.1] [x]
2. Một đường thẳng (dây chun) xuất hiện nối từ tâm trụ bắt đầu đến vị trí hiện tại của con trỏ (chuột/ngón tay). [Source: epics.md#Story 2.1] (FR2) [x]
3. Hoạt ảnh kéo dây phải mượt mà, duy trì ổn định 60 FPS ngay cả trên thiết bị di động. [Source: epics.md#Story 2.1] (NFR1) [x]
4. Hệ thống phải nhận diện được cả sự kiện Chuột (Mouse) và Chạm (Touch) một cách nhất quán. [Source: architecture.md#Cross-Cutting Concerns] [x]

## Tasks / Subtasks

- [x] Triển khai Hook Game Loop (`useGameLoop`)
  - [x] Tạo file `src/features/game/hooks/useGameLoop.ts`
  - [x] Sử dụng `requestAnimationFrame` để tạo một vòng lặp cập nhật liên tục.
- [x] Xây dựng Dynamic Layer
  - [x] Tạo file `src/features/game/components/DynamicLayer.tsx`.
  - [x] Sử dụng `useRef` để lưu trữ tọa độ dây đang kéo (Start point, End point).
- [x] Chuẩn hóa sự kiện Interaction
  - [x] Tạo file `src/features/game/hooks/useInteraction.ts`.
  - [x] Xử lý các sự kiện `pointerdown`, `pointermove`, `pointerup`.
- [x] Tích hợp vào App và Stage
  - [x] Cập nhật `StageContainer.tsx` để bao gồm `DynamicLayer`.
- [x] Unit Test cho Logic Tương tác
  - [x] Tạo `src/features/game/hooks/useInteraction.test.ts`.

## Dev Notes

- **🚨 Zero-Binding Performance**: Tọa độ kéo dây được quản lý hoàn toàn qua `Refs` trong `useInteraction` và được vẽ trực tiếp bởi `DynamicLayer` trong vòng lặp `useGameLoop`, đảm bảo không gây re-render React khi di chuyển chuột.
- **Coordinate Spaces**: Sử dụng `stage.getAbsoluteTransform().invert()` để đồng nhất tọa độ con trỏ (page space) với tọa độ bàn cờ (stage space).
- **Elastic Visuals**: Dây kéo có hiệu ứng "glow" và độ dày thay đổi theo chiều dài (càng dài càng mảnh) để tăng cảm giác vật lý.

### Project Structure Notes

- **Hooks**: `src/features/game/hooks/`
- **Components**: `src/features/game/components/`

### References

- [Architecture: State & Data Flow Patterns](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/architecture.md#L107-113)

## Dev Agent Record

### Agent Model Used

Antigravity (Amelia persona)

### Debug Log References

- [useInteraction.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.test.ts): Verified pointer handling and coordinate conversion.

### Completion Notes List

- ✅ Implementation of high-performance drag logic using `Refs`.
- ✅ Integrated `requestAnimationFrame` via `useGameLoop`.
- ✅ Visual "Elastic" feedback implemented with Konva Line.
- ✅ Unit tests passing for interaction logic.

### File List

- [src/features/game/hooks/useGameLoop.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useGameLoop.ts)
- [src/features/game/hooks/useInteraction.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.ts)
- [src/features/game/hooks/useInteraction.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.test.ts)
- [src/features/game/components/DynamicLayer.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/DynamicLayer.tsx)
- [src/features/game/components/StageContainer.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/StageContainer.tsx)
