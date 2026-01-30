# Story 1.1: Khởi tạo dự án và Bố cục bàn cờ lục giác

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Người chơi,
I want nhìn thấy bàn cờ lục giác với các trụ (pegs) được sắp xếp ngay ngắn khi mở game,
so that tôi biết mình đang chuẩn bị chơi game Fighting Chess.

## Acceptance Criteria

1. Dự án đã được khởi tạo bằng Vite React TS và Konva. [Source: epics.md#Story 1.1] [x]
2. Bàn cờ lục giác hiển thị đúng số lượng và bố cục của các trụ (pegs) trên Canvas (FR1). [Source: epics.md#Story 1.1] [x]
3. Bàn cờ tự động co giãn (Responsive) phù hợp với kích thước màn hình thiết bị (NFR4). [Source: epics.md#Story 1.1] [x]
4. Giao diện mượt mà, đạt 60 FPS (NFR1). [Source: prd.md#Performance] [x]
5. Vùng tương tác của trụ (Hit Area) lớn hơn 20% so với hình ảnh hiển thị (NFR6). [Source: prd.md#Non-Functional Requirements] [x]

## Tasks / Subtasks

- [x] Khởi tạo dự án Vite React TS
  - [x] Chạy `npm create vite@latest . -- --template react-ts` (nếu thư mục chưa có code)
  - [x] Cài đặt các dependency cần thiết: `konva`, `react-konva`, `zustand`
- [x] Thiết lập cấu trúc thư mục theo kiến trúc Feature-based
  - [x] Tạo `src/features/game/components`, `src/features/game/logic`, `src/features/game/store`
- [x] Xây dựng Logic Bàn cờ Lục giác (Hex Grid Logic)
  - [x] Triển khai hệ tọa độ lục giác (Axial hoặc Cube coordinates) trong `src/features/game/logic/grid-utils.ts`
  - [x] Hàm tính toán vị trí Pixel (X, Y) từ tọa độ lục giác
- [x] Phát triển Layer Bàn cờ (Static Layer)
  - [x] Component `StaticLayer.tsx` hiển thị Background và các Trụ (Pegs)
  - [x] Tối ưu hóa: Sử dụng `peg.listening(false)` cho các thành phần trang trí không tương tác
  - [x] Đàm bảo Hit Area của Trụ lớn hơn 20% so với hình ảnh (sử dụng Circle vô hình hoặc padding)
- [x] Triển khai Responsive Stage
  - [x] Tự động tính toán Scale cho Stage để bàn cờ luôn nằm giữa và vừa khít màn hình

## Dev Notes

- **Separation of Concerns**: Giữ logic hình học (grid-utils.ts) thuần TypeScript, không phụ thuộc vào React/Konva. [Source: architecture.md#Architectural Boundaries]
- **Performance**:
  - Không ràng buộc dữ liệu tọa độ vào React State trực tiếp (sử dụng Refs cho Game Loop ở các story sau).
  - Sử dụng `react-konva` Stage và Layer hợp lý.
- **Konva Best Practices**:
  - Đặt `perfectDrawEnabled={false}` cho các trụ nếu chúng có fill và stroke đơn giản.
  - Sử dụng `cache()` cho layer tĩnh nếu bàn cờ có số lượng trụ lớn.

### Project Structure Notes

- **Feature Directory**: `src/features/game/`
- **Naming**: 
  - Components: PascalCase (`StageContainer.tsx`)
  - Logic: kebab-case (`grid-utils.ts`)

### References

- [PRD: Functional Requirements #FR-GAME-01](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/prd.md#L149)
- [Architecture: Selected Starter](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/architecture.md#L50)
- [Architecture: Project Structure](file:///home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/architecture.md#131)

## Dev Agent Record

### Agent Model Used

Antigravity (Amelia persona)

### Debug Log References

- [grid-utils.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/grid-utils.test.ts): Verified axial to pixel conversion and grid generation logic.
- Browser verification: Tested responsiveness and centering at various resolutions.

### Completion Notes List

- ✅ Project initialized with Vite React TS and Konva.
- ✅ Hexagonal grid logic implemented in `grid-utils.ts` using axial coordinates.
- ✅ Unit tests passing for core coordinate transformations and grid generation.
- ✅ `StaticLayer` implemented for display-only pegs with optimization (`perfectDrawEnabled={false}` and `layer.cache()`).
- ✅ `StageContainer` implemented for responsive scaling and centering.
- ✅ Hit area for pegs implemented using an invisible Circle 20% larger than the visual peg.
- ✅ Fixed issues from CR: Added missing tests, cleaned up unused config, fixed hit area effectiveness.

### File List

- [package.json](file:///home/thannv/workspace/cpx-qlnd/package.json)
- [vite.config.ts](file:///home/thannv/workspace/cpx-qlnd/vite.config.ts)
- [vitest.config.ts](file:///home/thannv/workspace/cpx-qlnd/vitest.config.ts)
- [tsconfig.json](file:///home/thannv/workspace/cpx-qlnd/tsconfig.json)
- [index.html](file:///home/thannv/workspace/cpx-qlnd/index.html)
- [src/main.tsx](file:///home/thannv/workspace/cpx-qlnd/src/main.tsx)
- [src/App.tsx](file:///home/thannv/workspace/cpx-qlnd/src/App.tsx)
- [src/features/game/logic/grid-utils.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/grid-utils.ts)
- [src/features/game/logic/grid-utils.test.ts](file:///home/thannv/workspace/cpx-qlnd/src/features/game/logic/grid-utils.test.ts)
- [src/features/game/components/StaticLayer.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/StaticLayer.tsx)
- [src/features/game/components/StageContainer.tsx](file:///home/thannv/workspace/cpx-qlnd/src/features/game/components/StageContainer.tsx)
