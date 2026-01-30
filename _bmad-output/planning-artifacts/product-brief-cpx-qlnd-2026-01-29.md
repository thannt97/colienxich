---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2026-01-29
author: Thannv
---

# Product Brief: cpx-qlnd

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

"Cờ Đối Kháng" là phiên bản kỹ thuật số của trò chơi chiến thuật theo lượt trên bàn cờ lục giác. Trò chơi mô phỏng cơ chế căng dây thun qua các trụ để tạo thành đường thẳng và chiếm lãnh thổ. Trò chơi nhấn mạnh tư duy không gian và chiến thuật chặn đường, mang lại trải nghiệm cạnh tranh đơn giản nhưng sâu sắc cho hai người chơi.

---

## Core Vision

### Problem Statement
Người chơi yêu thích các game chiến thuật chiếm lãnh thổ thiếu một phiên bản số hóa của cơ chế "căng dây thun" cụ thể này trên lưới lục giác. Các phiên bản vật lý bị giới hạn bởi số lượng dây và thời gian thiết lập.

### Proposed Solution
Một web-game 2 người chơi với các tính năng:
- **Bàn cờ Lục giác**: Các hàng có 4, 5... điểm (trụ).
- **Cơ chế Dây thun**: Kéo thả hoặc chọn điểm để căng dây qua 4 trụ thẳng hàng.
- **Luật chơi**: Phải tiếp xúc dây có sẵn, không trùng hoàn toàn, tự động phát hiện tam giác "kín" để tính điểm và đặt quân.
- **Điều kiện thắng**: Chiếm nhiều tam giác nhất khi hết nước đi.

### Key Differentiators
- **Kiểm soát lãnh thổ hình học**: Khác với Cờ Vây hay Hex, lãnh thổ được chiếm bằng cách *bao vây* không gian bằng các đường giao nhau.
- **Trực quan hóa**: Giao diện dây thun tạo cảm giác kết nối và căng thẳng trực quan.


## Target Users

### Primary Users
- **Chiến lược gia Giải trí**: Những người tìm kiếm trò chơi trí tuệ nhẹ nhàng, nhanh gọn nhưng vẫn có chiều sâu chiến thuật để giải trí giữa giờ làm việc hoặc học tập.
- **Trẻ em & Gia đình**: Hướng đến môi trường chơi game lành mạnh, phát triển tư duy không gian và logic cho trẻ em, dễ dàng tiếp cận với luật chơi đơn giản.

### Secondary Users
- **Người chơi Cạnh tranh (Competitive Players)**: Nhóm người chơi thích đua top, tranh hạng nếu game sau này phát triển thêm tính năng Ranking/Leaderboard.

### User Journey (Hành trình người chơi)
1. **Discovery**: Người chơi biết đến game qua link chia sẻ từ bạn bè hoặc mạng xã hội với hình ảnh bàn cờ dây thun độc đáo.
2. **Onboarding**: Truy cập webgame ngay lập tức mà không cần cài đặt. Hướng dẫn tương tác kéo thả trực quan giúp người chơi hiểu luật "tạo tam giác" chỉ sau 1-2 nước đi thử nghiệm.
3. **Core Usage**: Tham gia các ván đấu 1vs1 (với bot hoặc người khác) kéo dài 5-10 phút. Cảm giác thỏa mãn khi "bẫy" được đối phương hoặc tạo được chuỗi tam giác liên hoàn.
4. **Retention**: Quay lại chơi để thử các chiến thuật mới hoặc thách đấu bạn bè.


## Success Metrics

### Business Objectives
- **Chất lượng Sản phẩm**: Xây dựng một MVP hoàn chỉnh, chạy mượt mà trên trình duyệt, không lỗi nghiêm trọng về logic game.
- **Tiềm năng Phát triển**: Chứng minh được gameplay đủ hấp dẫn để phát triển tiếp các tính năng online multiplayer hoặc mobile app.

### Key Performance Indicators (KPIs)
- **Time to Fun**: Người chơi hiểu luật và hoàn thành ván đầu tiên trong dưới 5 phút.
- **Completion Rate**: > 80% người chơi bắt đầu game sẽ chơi đến hết ván.
- **Bug-free Session**: 100% các ván chơi test không gặp lỗi tính điểm sai hoặc lỗi logic phát hiện tam giác.


## MVP Scope

### Core Features
- **Game Engine**: 
    - Render bàn cờ lục giác động (tuỳ chỉnh số lượng trụ).
    - Cơ chế kéo thả dây thun mượt mà, snap vào trụ gần nhất.
- **Game Logic**:
    - Validate hình học: Dây phải thẳng hàng 4 điểm, phải cắt hoặc chạm dây cũ.
    - Phát hiện Tam giác: Thuật toán đồ thị để tìm chu trình 3 đỉnh (tam giác) mới tạo thành.
    - Tính điểm & Lượt chơi: Quản lý lượt (Turn-based), cộng điểm và reset lượt đặt quân.
- **Game Mode**:
    - Local PvP: 2 người đổi lượt trên cùng 1 thiết bị.
    - Basic Bot: Bot máy chơi ngẫu nhiên (valid move).
- **UI/UX**: 
    - Màn hình Menu (Play, Rules).
    - Màn hình In-game (Điểm số, Lượt ai, Nút Reset/Undo).

### Out of Scope for MVP
- Tính năng chơi Online qua mạng (Real-time Multiplayer).
- Bot thông minh (AI thuật toán Minimax/AlphaBeta).
- Hệ thống tài khoản, lưu progress, bảng xếp hạng.
- Hiệu ứng âm thanh/nhạc nền phức tạp (chỉ dùng âm thanh cơ bản).

### MVP Success Criteria
- **Performance**: Game chạy ổn định 60fps trên trình duyệt web phổ thông.
- **Reliability**: Không có bug logic (tính sai điểm, không nhận diện được tam giác).
- **Usability**: Người dùng mới có thể chơi hết 1 ván mà không cần hỏi thêm luật.

### Future Vision
- Phát triển thành nền tảng thi đấu tư duy trực tuyến.
- Mở rộng sang Mobile App (iOS/Android).
- Thêm các biến thể bàn cờ và chế độ chơi giải đố (Puzzle Mode).

