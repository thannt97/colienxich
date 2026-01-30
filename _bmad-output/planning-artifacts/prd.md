---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
inputDocuments: ['/home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/product-brief-cpx-qlnd-2026-01-29.md']
classification:
  projectType: web_app
  domain: gaming
  complexity: medium
  projectContext: greenfield
workflowType: 'prd'
---

# Product Requirements Document - cpx-qlnd

**Author:** Thannv
**Date:** 2026-01-29

## Success Criteria

### User Success
*   **Instant Play**: Người chơi có thể vào game và chơi ngay trong vòng 5 giây (không loading lâu, không đăng ký).
*   **Intuitive**: Người chơi hiểu luật "tạo tam giác" sau tối đa 2 lần thử sai.
*   **Engagement**: Trung bình mỗi user chơi tối thiểu 2 ván/phiên.

### Business Success
*   **MVP Delivery**: Hoàn thành bản chạy được trên web trong vòng 2 tuần (Sprint đầu tiên).
*   **Quality**: Zero critical bugs liên quan đến logic tính điểm trong bản release đầu tiên.

### Technical Success
*   **Performance**: Duy trì 60 FPS trên các thiết bị di động tầm trung (như iPhone X trở lên).
*   **Algorithm Accuracy**: Thuật toán phát hiện tam giác chính xác 100% trong mọi trường hợp phức tạp (lồng nhau, chung cạnh).
*   **Compatibility**: Chạy tốt trên Chrome, Safari, Firefox (Desktop & Mobile).

### Measurable Outcomes
*   **Time to Fun**: < 5 phút.
*   **Completion Rate**: > 80%.

## Product Scope

### MVP - Minimum Viable Product
*   **Core Experience**: Bàn cờ lục giác size tiêu chuẩn, cơ chế kéo dây, validate luật, tính điểm.
*   **Modes**: Local PvP (Hotseat), Random Bot.
*   **UI**: Scoreboard, Turn indicator, Reset/Undo.

### Growth Features (Post-MVP)
*   **Online**: Room code để chơi với bạn bè từ xa.
*   **Smart Bot**: AI có khả năng chặn đường và tạo bẫy.
*   **Progression**: Hệ thống cấp độ/huy hiệu đơn giản.

### Vision (Future)
*   **Competitive Platform**: Hệ thống rank, giải đấu online.
*   **Mobile App**: Native app trên Store.

## User Journeys

### 1. The Quick Match (Primary Journey)
**Persona**: "Chiến lược gia Giải trí" - Anh Nam (28t, NVVP), muốn giải trí nhanh 10p giữa giờ làm.
*   **Scene**: Nam mở tab trình duyệt mới, gõ tên game.
*   **Action**: Trang web load ngay lập tức bàn cờ lục giác. Nam thấy nút "Chơi Ngay" (Play vs Bot) to rõ giữa màn hình.
*   **Gameplay**:
    *   Lượt 1: Nam kéo dây tạo đường thẳng. Dây rung nhẹ và phát âm thanh "tưng" khi thả tay (snap vào trụ).
    *   Lượt Bot: Bot đáp trả ngay lập tức.
    *   ...
    *   Lượt 5: Nam phát hiện cơ hội, kéo dây tạo thành một tam giác nhỏ. Hệ thống tự động tô màu xanh (màu của Nam) vào tam giác, hiện số "+1 điểm".
*   **Resolution**: Hết chốt (trụ), game hiện bảng kết quả: "You Win! 5-3". Nam hài lòng, bấm "Replay" để chơi ván nữa.

### 2. The Learning Curve (New User Journey)
**Persona**: Bé Bi (10t), lần đầu chơi.
*   **Scene**: Bé Bi được anh trai gửi link.
*   **Action**: Vào game, Bi chưa hiểu luật, kéo bừa một dây không đi qua đủ 4 điểm.
*   **Error Handling**: Dây chuyển màu đỏ, hiện thông báo nhỏ "Kéo qua 4 điểm nhé!". Dây tự thu về vị trí cũ.
*   **Discovery**: Bi thử lại, kéo đúng. Dây chuyển màu trắng, nằm yên trên bàn cờ. Bi cười thích thú.

### Journey Requirements Summary
*   **Onboarding**: Không cần tutorial dài dòng, dùng visual feedback (dây đỏ/trắng, text hướng dẫn tại chỗ) để dạy luật.
*   **Feedback System**: Âm thanh/Hình ảnh phản hồi tức thì cho mọi thao tác (kéo, thả, lỗi, ghi điểm).
*   **Game Flow**: Tốc độ game nhanh, không có Animation rườm rà làm chậm luồng chơi.

## Domain-Specific Requirements

### Technical Constraints (Game Standards)
*   **Frame Rate Stability**: Game loop phải đảm bảo xấp xỉ 60fps. Tránh hiện tượng giật lag khi kéo dây (physic interaction).
*   **Asset Optimization**: Tổng dung lượng assets (ảnh, âm thanh) tải về lần đầu < 5MB để đảm bảo "Instant Play" trên 3G/4G.
*   **Touch Input Latency**: Độ trễ từ khi ngón tay di chuyển đến khi dây phản hồi trên màn hình < 50ms (cảm giác "thật").

### Fairness & Logic Integrity
*   **Deterministic Logic**: Thuật toán kiểm tra tam giác phải trả về kết quả giống hệt nhau trên mọi trình duyệt/thiết bị.
*   **State Consistency**: Trạng thái bàn cờ (vị trí dây, điểm số) phải đồng bộ tuyệt đối giữa 2 lượt chơi (tránh bug "bóng ma" - dây hiển thị nhưng logic không ghi nhận).

### Accessibility (Tiêu chuẩn Web)
*   **Responsive Scaling**: Bàn cờ phải tự động scale vừa khít màn hình (dọc cho mobile, ngang cho desktop) mà không bị méo tỷ lệ.
*   **Color Blind Support**: Màu sắc dây và trụ phải phân biệt được bằng độ tương phản, không chỉ dựa vào màu sắc (ví dụ: Dây Player 1 sáng/đậm vs Dây Player 2 tối/nhạt).

## Web App Specific Requirements

### Architecture
*   **Type**: **Single Page Application (SPA)**.
*   **Tech Stack**:
    *   **Framework**: **React** (Latest version).
    *   **State Management**: **Zustand** (Lightweight, well-suited for game state).
    *   **Rendering**: **react-konva** (Canvas wrapper for React) for performant drag-and-drop interactions.
    *   **Build Tool**: **Vite**.

### Browser Matrix (Target Support)
*   **Desktop**: Chrome, Safari, Edge, Firefox (Last 2 versions).
*   **Mobile**: Global support (iOS/Android Webview compatible).

### SEO & PWA
*   **PWA**: Installable support via Service Worker (manifest.json).
*   **SEO**: React Helmet for meta tag management (Open Graph for social sharing).

## Project Scoping & Phased Development

### MVP Strategy (Phase 1)
*   **Focus**: Core Mechanics & Performance. Validate "fun" factor.
*   **Timeline**: 2 Weeks.
*   **Key Features**:
    1.  **Game Board**: Hex grid + Pegs logic (Canvas rendering).
    2.  **Physics**: Elastic rubber band interaction (drag, stretch, snap, vibration).
    3.  **Core Logic**: Triangle detection algorithm & Scoring system.
    4.  **Bot**: Random Bot for single player practice.

### Phase 2: Growth (Post-MVP)
*   **Focus**: Engagement & Retention.
*   **Features**:
    1.  **Smart Bot**: Minimax Algorithm for challenging gameplay.
    2.  **PWA Offline**: Asset caching for offline play.
    3.  **Local Storage**: Recent match history and High Score.

### Phase 3: Expansion (Future)
*   **Focus**: Community & Competition.
*   **Features**:
    1.  **Online PvP**: Real-time multiplayer via Socket.io/WebRTC.
    2.  **Leaderboard**: Global ranking system.

### Risk Mitigation Strategy
*   **Technical Risk (React Overhead)**: Performance drop due to frequent state updates.
    *   *Mitigation*: Use  with distinct animation layer (not managed by main React render cycle) or  for physics interactions.
*   **Market Risk (User Drop-off)**: Players find rules confusing.
    *   *Mitigation*: Implement immediate visual onboarding (red/green lines indicating valid moves) during the first game.

## Functional Requirements

### Gameplay Mechanics (Game Board & Interaction)
*   **FR-GAME-01**: Hệ thống hiển thị bàn cờ lưới lục giác với các trụ (pegs) theo bố cục chuẩn.
*   **FR-GAME-02**: Người chơi có thể kéo chuột/ngón tay từ một trụ này sang trụ khác để tạo dây chun.
*   **FR-GAME-03**: Dây chun phải "snap" (hít) vào trụ gần nhất khi thả tay.
*   **FR-GAME-04**: Hệ thống phải chặn không cho tạo dây đè lên dây đã có (trùng lặp).
*   **FR-GAME-05**: Hệ thống phải phát hiện đường cắt nhau giữa các dây để tạo thành hình tam giác. Quy tắc mới: Chỉ tính điểm cho các tam giác có cạnh bằng 1 (3 trụ kề nhau) và không tính điểm cho tam giác lồng nhau.
*   **FR-GAME-06**: Khi tam giác (kích thước 1) được hình thành, hệ thống phải tự động tô màu của người chơi vào khu vực đó và cộng điểm.

### Game Mode & Logic
*   **FR-MODE-01**: Chế độ Single Player: Người chơi đấu với Bot (Random AI).
*   **FR-MODE-02**: Chế độ Hotseat: 2 người chơi lần lượt trên cùng một thiết bị.
*   **FR-LOGIC-01**: Mỗi người chơi có 1 lượt đi (turn-based).
*   **FR-LOGIC-02**: Trò chơi kết thúc khi không còn nước đi hợp lệ hoặc hết trụ trống (điều kiện cụ thể sẽ playtest).

### UI & Feedback
*   **FR-UI-01**: Dashboard hiển thị điểm số hiện tại (Player vs Opponent).
*   **FR-UI-02**: Hiển thị lượt đi hiện tại (Whose turn?).
*   **FR-UI-03**: Nút "Reset Game" để chơi lại từ đầu.
*   **FR-UI-04**: Hiệu ứng rung (Haptic Feedback) khi kéo dây và khi ghi điểm (chỉ trên Mobile).

### Bot AI (Random)
*   **FR-AI-01**: Bot tự động thực hiện lượt đi sau khi người chơi hoành thành lượt của mình (delay 500ms-1s để tạo cảm giác tự nhiên).
*   **FR-AI-02**: Bot chọn ngẫu nhiên một nước đi hợp lệ (không cần thông minh, chỉ cần đúng luật).

## Non-Functional Requirements

### Performance
*   **FPS Target**: Stable **60 FPS** usage during gameplay (interactions, animations). Drops below 30 FPS for >100ms considered critical.
*   **Startup Time**: Time to Interactive (TTI) < **2 seconds** on 4G networks.
*   **Input Latency**: Touch/Click response latency < **50ms**.

### Compatibility & Reliability
*   **Device Support**: Responsive layout on devices with width > 320px (iPhone SE+).
*   **Offline Tolerance**: Graceful handling of network loss; allows completion of current local/bot match without crashing.

### Usability
*   **Hit Area**: Interaction zones for Pegs must be at least **20% larger** than the visual asset for easier touch targeting.
*   **Error Prevention**: Visual indicators (disabled states, red lines) to prevent invalid moves.
