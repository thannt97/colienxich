---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments: ['/home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/prd.md', '/home/thannv/workspace/cpx-qlnd/_bmad-output/planning-artifacts/architecture.md']
---

# cpx-qlnd - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for cpx-qlnd, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Hệ thống hiển thị bàn cờ lưới lục giác với các trụ (pegs) theo bố cục chuẩn.
FR2: Người chơi có thể kéo chuột/ngón tay từ một trụ này sang trụ khác để tạo dây chun.
FR3: Dây chun phải "snap" (hít) vào trụ gần nhất khi thả tay.
FR4: Hệ thống phải chặn không cho tạo dây đè lên dây đã có (trùng lặp).
FR5: Hệ thống phải phát hiện đường cắt nhau giữa các dây để tạo thành hình tam giác.
FR6: Khi tam giác được hình thành, hệ thống phải tự động tô màu của người chơi vào khu vực đó và cộng điểm.
FR7: Chế độ Single Player: Người chơi đấu với Bot (Random AI).
FR8: Chế độ Hotseat: 2 người chơi lần lượt trên cùng một thiết bị.
FR9: Mỗi người chơi có 1 lượt đi (turn-based).
FR10: Trò chơi kết thúc khi không còn nước đi hợp lệ hoặc hết trụ trống.
FR11: Dashboard hiển thị điểm số hiện tại (Player vs Opponent) và lượt đi hiện tại.
FR12: Nút "Reset Game" để chơi lại từ đầu và hiệu ứng rung (Haptic Feedback) khi kéo dây/ghi điểm (Mobile).

### NonFunctional Requirements

NFR1: Duy trì ổn định 60 FPS trong suốt quá trình chơi game.
NFR2: Thời gian phản hồi Touch/Click (Input Latency) < 50ms.
NFR3: Thời gian tải trang (TTI) < 2 giây trên mạng 4G.
NFR4: Giao diện Responsive hỗ trợ các thiết bị có chiều rộng > 320px.
NFR5: Hỗ trợ chơi offline (Offline Tolerance) cho các trận đấu local/bot.
NFR6: Vùng tương tác của Trụ (Hit Area) phải lớn hơn ít nhất 20% so với hình ảnh hiển thị.

### Additional Requirements

- **Starter Template**: Sử dụng Vite React TypeScript (`npm create vite@latest cpx-qlnd -- --template react-ts`).
- **State Management**: Sử dụng chiến lược tách biệt trạng thái (Split strategy): Zustand cho UI State (Score, Turn) và Refs/Mutable cho Game Loop State (Coordinates, Physics).
- **Game Engine Loop**: Sử dụng custom `requestAnimationFrame` hook để điều phối.
- **Canvas Layering**: Tối ưu hóa đa lớp (Multi-layer): StaticLayer (Background + Pegs) và DynamicLayer (Dragging lines).
- **Directory Structure**: Tổ chức theo Feature-based (`src/features/game`).
- **Input Normalization**: Chuẩn hóa sự kiện Pointer (Mouse/Touch) trong một dịch vụ duy nhất.
- **Performance Policy**: Không ràng buộc dữ liệu hoạt ảnh tần suất cao vào React State.

### FR Coverage Map

FR1: Epic 1 - Bố cục bàn cờ và trụ
FR2: Epic 2 - Tương tác kéo dây (Elastic Physics)
FR3: Epic 2 - Cơ chế snap dây vào trụ
FR4: Epic 2 - Kiểm tra trùng lặp dây
FR5: Epic 3 - Thuật toán phát hiện tam giác và kiểm tra cắt nhau
FR6: Epic 3 - Hệ thống ghi điểm và tô màu tam giác
FR7: Epic 4 - Tích hợp AI Bot (Random)
FR8: Epic 4 - Chế độ chơi Hotseat
FR9: Epic 1 - Quản lý lượt chơi (Turn Management)
FR10: Epic 3 - Điều kiện kết thúc trò chơi
FR11: Epic 1 - Dashboard (Scoreboard/Turn Indicator)
FR12: Epic 1 - Game State Control (Reset) & Feedback (Haptic)

## Epic List

### Epic 1: Cơ sở hạ tầng Game & Dashboard
Thiết lập môi trường Game, hiển thị bàn cờ, quản lý lượt chơi và trạng thái cơ bản để người dùng có thể thấy được khung cảnh trò chơi.

### Epic 2: Cơ chế Tương tác Vật lý (Rubber Band)
Hiện thực hóa trải nghiệm "kéo dây chun" đặc trưng, bao gồm việc kéo, thả, hít trụ và đảm bảo luật chơi cơ bản về vị trí dây.

### Epic 3: Logic Trò chơi & Tính điểm
Phát triển "linh hồn" của game với thuật toán phát hiện tam giác, ghi điểm tự động và xác định kết thúc trận đấu.

### Epic 4: Chế độ chơi & Đối thủ
Mở rộng khả năng chơi với chế độ Hotseat (2 người tại chỗ) và tích hợp AI Bot cơ bản để người dùng có thể chơi một mình.

---

## Epic 1: Cơ sở hạ tầng Game & Dashboard
Thiết lập môi trường Game, hiển thị bàn cờ, quản lý lượt chơi và trạng thái cơ bản để người dùng có thể thấy được khung cảnh trò chơi.

### Story 1.1: Khởi tạo dự án và Bố cục bàn cờ lục giác
As a Người chơi,
I want nhìn thấy bàn cờ lục giác với các trụ (pegs) được sắp xếp ngay ngắn khi mở game,
So that tôi biết mình đang chuẩn bị chơi game Fighting Chess.

**Acceptance Criteria:**
- **Given** Dự án đã được khởi tạo bằng Vite React TS và Konva.
- **When** Ứng dụng khởi động thành công.
- **Then** Bàn cờ lục giác hiển thị đúng số lượng và bố cục của các trụ (pegs) trên Canvas (FR1).
- **And** Bàn cờ tự động co giãn (Resposive) phù hợp với kích thước màn hình thiết bị (NFR4).

### Story 1.2: Dashboard thông tin trận đấu (Score & Turn)
As a Người chơi,
I want biết số điểm hiện tại và lượt đi đang thuộc về ai,
So that tôi có thể theo dõi tiến trình trận đấu và đưa ra chiến lược phù hợp.

**Acceptance Criteria:**
- **Given** Trò chơi đang trong trạng thái Active.
- **When** Một hành động ghi điểm hoặc đổi lượt xảy ra (ở các story sau).
- **Then** Dashboard hiển thị rõ ràng điểm số của Player và Opponent (FR11).
- **And** Chỉ báo lượt đi (Turn Indicator) hiển thị đúng người chơi đang thực hiện lượt (FR9).

### Story 1.3: Điều khiển trò chơi và Hiệu ứng phản hồi
As a Người chơi,
I want có thể chơi lại từ đầu và nhận được phản hồi rung khi thao tác,
So that tôi chủ động trong việc bắt đầu trận đấu mới và cảm thấy tương tác sống động hơn.

**Acceptance Criteria:**
- **Given** Trò chơi đang chạy hoặc đã kết thúc.
- **When** Tôi nhấn nút "Reset Game".
- **Then** Trạng thái bàn cờ, điểm số và lượt đi quay về giá trị khởi tạo (FR12).
- **When** Có sự tương tác (logic giả lập cho kéo dây ở story sau).
- **Then** Thiết bị di động phản hồi rung (Haptic Feedback) (FR12 - NFR2).

---

## Epic 2: Cơ chế Tương tác Vật lý (Rubber Band)
Hiện thực hóa trải nghiệm "kéo dây chun" đặc trưng, bao gồm việc kéo, thả, hít trụ và đảm bảo luật chơi cơ bản về vị trí dây.

### Story 2.1: Cơ chế kéo dây đàn hồi (Elastic Dragging)
As a Người chơi,
I want kéo ngón tay/chuột từ một trụ để tạo thành một sợi dây chun co giãn theo tay mình,
So that tôi có thể nhắm đến trụ đích để thực hiện nước đi.

**Acceptance Criteria:**
- **Given** Đến lượt của người chơi và đang nhấn vào một trụ (peg).
- **When** Di chuyển ngón tay/chuột đến vị trí khác.
- **Then** Một đường thẳng (dây chun) xuất hiện nối từ trụ bắt đầu đến vị trí hiện tại của tay/chuột (FR2).
- **And** Hiển thị hoạt ảnh co giãn mượt mà (Elastic Animation) đảm bảo 60 FPS (NFR1).

### Story 2.2: Cơ chế Hít trụ (Peg Snapping) và Tạo dây
As a Người chơi,
I want dây chun tự động "hít" vào trụ gần nhất khi tôi thả tay,
So that thao tác của tôi chính xác ngay cả khi tôi không trỏ đúng tâm trụ.

**Acceptance Criteria:**
- **Given** Đang trong trạng thái kéo dây.
- **When** Thả ngón tay/chuột ở gần một trụ hợp lệ.
- **Then** Dây chun tự động được gắn chặt vào tâm của trụ đích (Snap) (FR3).
- **And** Một đoạn dây mới được lưu lại trên bàn cờ.
- **And** Vùng tương tác của trụ (Hit Area) lớn hơn 20% so với hình ảnh (NFR6).

### Story 2.3: Kiểm tra tính hợp lệ và Trùng lặp
As a Người chơi,
I want hệ thống ngăn chặn tôi thực hiện những nước đi không hợp lệ (như chồng chéo dây),
So that luật chơi được đảm bảo tuyệt đối.

**Acceptance Criteria:**
- **Given** Đang thực hiện nước đi kéo dây.
- **When** Thả dây vào một vị trí đã có dây hoặc trùng lặp hoàn toàn với dây hiện có.
- **Then** Hệ thống từ chối nước đi, dây chun biến mất và hiển thị cảnh báo (FR4).
- **And** Người chơi vẫn giữ nguyên lượt đi để thử lại.

---

## Epic 3: Logic Trò chơi & Tính điểm
Phát triển "linh hồn" của game với thuật toán phát hiện tam giác, ghi điểm tự động và xác định kết thúc trận đấu.

### Story 3.1: Thuật toán Phát hiện cắt nhau và Tạo tam giác
As a Hệ thống,
I want tự động phát hiện khi các dây chun tạo thành một hình tam giác kín khít,
So that tôi có thể xác định khi nào người chơi ghi được điểm.

**Acceptance Criteria:**
- **Given** Một nước đi kéo dây vừa được hoàn thành.
- **When** Thuật toán `triangle-detector` chạy.
- **Then** Hệ thống xác định chính xác tất cả các tam giác mới được hình thành có cạnh bằng 1. Các tam giác lớn hơn hoặc tam giác lồng nhau sẽ bị bỏ qua (FR5).
- **And** Thuật toán phải đảm bảo tính nhất quán trên mọi thiết bị (NFR91).

### Story 3.2: Hệ thống Ghi điểm và Tô màu (Scoring & Filling)
As a Người chơi,
I want nhìn thấy tam giác mình vừa tạo được tô màu và điểm số của mình tăng lên ngay lập tức,
So that tôi cảm thấy được thưởng cho nước đi thông minh của mình.

**Acceptance Criteria:**
- **Given** Một tam giác mới được phát hiện.
- **When** Hệ thống cập nhật trạng thái.
- **Then** Khu vực bên trong tam giác (kích thước 1) được tô màu đại diện của người chơi (FR6).
- **And** Điểm số trên Dashboard tăng lên tương ứng với số tam giác (kích thước 1) tạo được (+1 mỗi tam giác) (FR6).
- **And** Phát âm thanh/hiệu ứng chúc mừng ngay lập tức (FR80).

### Story 3.3: Điều kiện kết thúc trò chơi (Game Over Logic)
As a Người chơi,
I want biết khi nào trò chơi kết thúc và kết quả cuối cùng ai là người thắng,
So that tôi có thể kết thúc ván đấu và bắt đầu ván mới.

**Acceptance Criteria:**
- **Given** Bàn cờ không còn nước đi hợp lệ hoặc hết trụ trống.
- **When** Kiểm tra điều kiện kết thúc mỗi lượt.
- **Then** Hệ thống dừng trò chơi và hiển thị bảng thông báo kết quả "You Win/Lose" (FR10).
- **And** Tổng điểm được hiển thị chính xác (FR69).

---

## Epic 4: Chế độ chơi & Đối thủ
Mở rộng khả năng chơi với chế độ Hotseat (2 người tại chỗ) và tích hợp AI Bot cơ bản để người dùng có thể chơi một mình.

### Story 4.1: Chế độ chơi Hotseat (Local PvP)
As a Hai người chơi tại chỗ,
I want luân phiên thực hiện lượt đi trên cùng một thiết bị,
So that chúng tôi có thể thi đấu trực tiếp với nhau.

**Acceptance Criteria:**
- **Given** Trò chơi được khởi động ở chế độ Hotseat.
- **When** Người chơi 1 hoàn thành lượt đi.
- **Then** Hệ thống chuyển quyền điều khiển sang Người chơi 2 và cập nhật Turn Indicator (FR8).
- **And** Lịch sử các dây đã kéo được giữ nguyên cho cả hai người (FR159).

### Story 4.2: Tích hợp AI Bot (Random AI)
As a Người chơi đơn,
I want đấu với một đối thủ máy tính đơn giản,
So that tôi có thể tập luyện và giải trí một mình.

**Acceptance Criteria:**
- **Given** Trò chơi được khởi động ở chế độ Single Player.
- **When** Người chơi hoàn thành lượt đi.
- **Then** AI Bot tự động phân tích và thực hiện một nước đi ngẫu nhiên hợp lệ sau một khoảng trễ ngắn (500ms-1s) (FR7, FR169, FR170).
- **And** Nước đi của Bot tuân thủ toàn bộ luật chơi về kéo dây và hít trụ.
