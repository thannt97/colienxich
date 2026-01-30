# User Story 2.2: Cơ chế hít trụ (Peg Snapping) và Tạo dây

Status: done

## Story

As a Người chơi,
I want dây chun tự động "hít" vào trụ gần nhất khi tôi thả tay,
so that thao tác của tôi chính xác ngay cả khi tôi không trỏ đúng tâm trụ.

## Acceptance Criteria

1. Khi người chơi thả chuột/tay (pointerup) trong vùng lân cận của một trụ, dây chun phải tự động dịch chuyển tâm (snap) vào đúng tọa độ của trụ đó (FR3). [Source: epics.md#Story 2.2] [ ]
2. Nếu snap thành công và trụ kết thúc khác với trụ bắt đầu, một đoạn dây chun cố định mới sẽ được thêm vào bàn cờ. [Source: epics.md#Story 2.2] [ ]
3. Nếu thả tay ở vị trí không có trụ hoặc không hợp lệ, dây chun đang kéo phải biến mất mà không tạo ra dây mới. [Source: epics.md#Story 2.2] [ ]
4. Vùng "hít" (snap range) phải khớp với Hit Area của trụ (lớn hơn 20% so với hình ảnh hiển thị) (NFR6). [Source: prd.md#Usability] [ ]
5. Toàn bộ trạng thái các dây đã tạo phải được lưu trữ trong Zustand store để đảm bảo đồng bộ (FR12). [Source: architecture.md#State Management] [ ]

## Technical Requirements

- **Coordinate Conversion**: Bổ sung hàm `pixelToAxial` và `roundAxial` vào `grid-utils.ts` để chuyển đổi tọa độ chuột sang tọa độ hex nhằm xác định trụ gần nhất.
- **State Management**:
    - Cập nhật `game-store.ts` để bao gồm mảng `lines: Array<{ start: Axial, end: Axial }>`.
    - Triển khai action `addLine` để cập nhật trạng thái game.
- **Zero-Binding Performance**:
    - Việc tính toán snap vẫn thực hiện trong `useInteraction.ts`.
    - Chỉ cập nhật Zustand store ( gây re-render) khi kết thúc thao tác kéo (pointerup).
- **Rendering**:
    - Sử dụng `StaticLayer.tsx` hoặc một layer chuyên biệt để vẽ các dây cố định nhằm tối ưu hiệu năng.

## Developer Context

- **Previous Work**: Story 2.1 đã triển khai logic kéo dây mượt mà (60 FPS) sử dụng Refs. Tuyệt đối không đưa tọa độ kéo dây vào React State.
- **Architecture Compliance**:
    - Logic hình học phải nằm trong `grid-utils.ts` (Pure TS).
    - Tuân thủ quy tắc Feature-based folder structure (`src/features/game`).

## Dev Notes (Lessons from Epic 1)

- **Responsive**: Luôn sử dụng `stage.getAbsoluteTransform().invert()` để chuyển đổi tọa độ pointer sang stage coordinates vì bàn cờ có tính năng tự động scale.
- **Hit Area**: Hãy tận dụng logic `radius` của Hex Grid để xác định khoảng cách "hít" thay vì dùng hardcoded pixel values.

## Files to Modify
- [src/features/game/logic/grid-utils.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/grid-utils.ts)
- [src/features/game/store/game-store.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.ts)
- [src/features/game/hooks/useInteraction.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.ts)
- [src/features/game/components/StaticLayer.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/StaticLayer.tsx)

## Completion Checklist (for Dev Agent)
- [x] Implement math for axial snapping in `grid-utils.ts`.
- [x] Add unit tests for snapping math.
- [x] Implement `lines` state and `addLine` action in `game-store.ts`.
- [x] Update `useInteraction.ts` with snapping logic on `pointerup`.
- [x] Render permanent lines in the appropriate Layer component.
- [x] Verify that "Reset Game" clears all lines.
- [x] Add `isValidStraightLine` validation for 4-peg straight lines.

## Completion Notes

- ✅ Implemented `pixelToAxial` and `roundAxial` for coordinate snapping
- ✅ Implemented `axialDistance` for distance calculation
- ✅ Implemented `isValidStraightLine` to validate 4-peg straight lines
- ✅ Updated `game-store.ts` with `lines` array and `addLine` action
- ✅ Updated `useInteraction.ts` to detect nearest peg and create permanent lines
- ✅ Updated `StaticLayer.tsx` to render permanent lines
- ✅ All unit tests passing (grid, store, interaction)
- ✅ Manual browser verification successful

## Files Modified

- [src/features/game/logic/grid-utils.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/grid-utils.ts)
- [src/features/game/store/game-store.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.ts)
- [src/features/game/hooks/useInteraction.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.ts)
- [src/features/game/components/StaticLayer.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/StaticLayer.tsx)
- [src/features/game/logic/grid-utils.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/grid-utils.test.ts)
- [src/features/game/store/game-store.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/store/game-store.test.ts)
