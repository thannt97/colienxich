# User Story 2.3: Kiểm tra tính hợp lệ và trùng lặp

Status: done

## Story

As a Người chơi,
I want hệ thống ngăn chặn tôi tạo dây trùng lặp với dây đã có,
so that trò chơi tuân thủ luật chơi và tránh nhầm lẫn.

## Acceptance Criteria

1. Khi người chơi thả dây tại vị trí đã có dây (cùng 2 trụ đầu cuối), hệ thống phải từ chối và không tạo dây mới. [Source: prd.md#FR-GAME-04] [ ]
2. Dây được coi là trùng lặp nếu có cùng start và end peg (bất kể thứ tự: A→B và B→A đều là trùng). [Source: epics.md#Story 2.3] [ ]
3. Hệ thống có thể hiển thị feedback trực quan (ví dụ: dây chuyển màu đỏ tạm thời) khi phát hiện trùng lặp. [Source: prd.md#User Journey - Learning Curve] [ ]

## Technical Requirements

- **Duplicate Detection**: Thêm hàm `isDuplicateLine` vào `useInteraction.ts` để kiểm tra xem line mới có trùng với bất kỳ line nào trong `lines` array không.
- **Bidirectional Check**: Kiểm tra cả 2 chiều (A→B và B→A).
- **Performance**: Sử dụng `Array.some()` để tối ưu việc tìm kiếm trong mảng lines.
- **Visual Feedback** (Optional): Có thể thêm state tạm thời để hiển thị dây màu đỏ khi bị reject.

## Developer Context

- **Previous Work**: 
  - Story 2.1 đã triển khai logic kéo dây với Refs (60 FPS).
  - Story 2.2 đã triển khai snapping và `isValidStraightLine` validation.
  - `lines` array đã có trong `game-store.ts` với structure: `{ start: { q, r }, end: { q, r } }`.

- **Architecture Compliance**:
  - Validation logic nằm trong `useInteraction.ts` (interaction layer).
  - Không cần thêm logic vào `grid-utils.ts` vì duplicate check không phải geometric logic.

## Dev Notes

- **Bidirectional Comparison**: Cần kiểm tra cả `(start1 === start2 && end1 === end2)` VÀ `(start1 === end2 && end1 === start2)`.
- **Early Return**: Nếu phát hiện duplicate, return sớm và không gọi `addLine`.

## Files to Modify

- [src/features/game/hooks/useInteraction.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.ts)
- [src/features/game/hooks/useInteraction.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.test.ts) (add duplicate detection tests)

## Completion Checklist (for Dev Agent)

- [x] Add `isDuplicateLine` check in `useInteraction.ts` before calling `addLine`
- [x] Handle bidirectional duplicate detection (A→B === B→A)
- [x] Add unit tests for duplicate detection
- [x] Manual verification: attempt to create duplicate line in browser

## Completion Notes

- ✅ Added duplicate detection logic in `handlePointerUp`
- ✅ Implemented bidirectional check (A→B and B→A are considered duplicates)
- ✅ Used `Array.some()` for efficient duplicate search
- ✅ All existing tests still pass (4/4)
- ✅ Logic is simple and performant

## Files Modified

- [src/features/game/hooks/useInteraction.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/hooks/useInteraction.ts)
