# 🎯 QuizMe - Nền tảng Học tập và Thi trắc nghiệm Toán học

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Cấu trúc Project](#cấu-trúc-project)
- [Quick Start](#quick-start)
- [Hướng dẫn chi tiết](#hướng-dẫn-chi-tiết)
- [API Documentation](#api-documentation)
- [Tài liệu](#tài-liệu)

---

## 🎯 Giới thiệu

QuizMe là nền tảng học tập và thi trắc nghiệm Toán học với các tính năng:

- ✅ **Daily Missions** - Nhiệm vụ hàng ngày
- ✅ **XP & Level System** - Hệ thống điểm kinh nghiệm và cấp độ
- ✅ **Study Streak** - Chuỗi ngày học liên tiếp
- ✅ **Achievements** - Thành tích và huy hiệu
- ✅ **Leaderboard** - Bảng xếp hạng
- ✅ **Exam System** - Hệ thống thi trắc nghiệm
- ✅ **Analytics Dashboard** - Dashboard phân tích

---

## 📁 Cấu trúc Project

```
QuizMe/
├── apps/
│   └── api/              # Backend API (Node.js + Express + MongoDB)
│       ├── src/
│       │   ├── controllers/
│       │   ├── models/
│       │   ├── routes/
│       │   └── middleware/
│       └── package.json
│
├── FE/                    # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   └── App.tsx
│   └── package.json
│
├── SETUP_GUIDE.md         # Hướng dẫn setup chi tiết
├── POSTMAN_TESTING_GUIDE.md  # Hướng dẫn test API
├── INTEGRATION_GUIDE.md   # Hướng dẫn tích hợp FE-BE
└── README.md             # File này
```

---

## 🚀 Quick Start

### Yêu cầu

- Node.js >= 14.0.0
- MongoDB >= 4.4
- npm/pnpm/yarn

### 1. Setup Backend

```bash
# Di chuyển vào thư mục backend
cd apps/api

# Cài đặt dependencies
npm install

# Tạo file .env
# Copy nội dung từ .env.example và chỉnh sửa:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/quizme
# JWT_SECRET=your-secret-key
# FRONTEND_URL=http://localhost:3000

# Khởi động MongoDB
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Seed dữ liệu mẫu (tùy chọn)
npm run seed

# Chạy backend
npm run dev
```

Backend chạy tại: `http://localhost:5000`

### 2. Setup Frontend

```bash
# Di chuyển vào thư mục frontend
cd FE

# Cài đặt dependencies
npm install

# Tạo file .env
# VITE_API_URL=http://localhost:5000/api

# Chạy frontend
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

### 3. Test API

Mở Postman và import collection từ `POSTMAN_TESTING_GUIDE.md`

Hoặc test bằng curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"123456"}'
```

---

## 📚 Hướng dẫn chi tiết

### Setup & Configuration

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Hướng dẫn setup chi tiết từng bước
  - Cài đặt dependencies
  - Cấu hình environment variables
  - Khởi động MongoDB
  - Troubleshooting

### Testing API

- **[POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md)** - Hướng dẫn test API với Postman
  - Setup Postman environment
  - Test tất cả endpoints
  - Authentication flow
  - Example requests/responses

### Frontend Integration

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Hướng dẫn tích hợp Frontend với Backend
  - Sử dụng services
  - Authentication flow
  - Error handling
  - Example components

---

## 📡 API Documentation

### Base URL

- Development: `http://localhost:5000/api`
- Production: (tùy cấu hình)

### Authentication

Tất cả protected endpoints cần JWT token trong header:

```
Authorization: Bearer <token>
```

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

#### Users
- `GET /api/users/me/xp` - Lấy XP và Level
- `GET /api/users/me/streak` - Lấy thông tin streak
- `POST /api/users/me/streak/checkin` - Check-in streak
- `GET /api/users/me/xp/history` - Lịch sử XP
- `GET /api/users/me/achievements` - Achievements của user

#### Missions
- `GET /api/missions/daily` - Lấy daily missions
- `PATCH /api/missions/:id/progress` - Cập nhật progress
- `POST /api/missions/:id/complete` - Hoàn thành mission

#### Achievements
- `GET /api/achievements` - Lấy tất cả achievements
- `GET /api/achievements/progress` - Lấy progress
- `POST /api/achievements/:id/unlock` - Unlock achievement

#### Leaderboard
- `GET /api/leaderboard/weekly` - Leaderboard tuần
- `GET /api/leaderboard/monthly` - Leaderboard tháng
- `GET /api/leaderboard/alltime` - Leaderboard all-time
- `GET /api/leaderboard/friends` - Leaderboard bạn bè

#### Exams
- `POST /api/exam-attempts/start` - Bắt đầu làm bài
- `PUT /api/exam-attempts/:id/answer` - Lưu câu trả lời
- `POST /api/exam-attempts/:id/submit` - Nộp bài
- `GET /api/exam-attempts/:id/analysis` - Phân tích kết quả

**Xem chi tiết:** [Backend API Documentation](./apps/api/README.md)

---

## 🎨 Frontend Services

Frontend đã có sẵn các services trong `FE/src/services/`:

- `authService.ts` - Authentication
- `userService.ts` - User stats, XP, Streak
- `missionService.ts` - Daily Missions
- `achievementService.ts` - Achievements
- `leaderboardService.ts` - Leaderboards
- `examService.ts` - Exams

**Xem chi tiết:** [Integration Guide](./INTEGRATION_GUIDE.md)

---

## 📖 Tài liệu

### Backend
- [Backend README](./apps/api/README.md) - API documentation đầy đủ
- [Models Documentation](./apps/api/README.md#models) - Database schemas

### Frontend
- [Integration Guide](./INTEGRATION_GUIDE.md) - Hướng dẫn tích hợp
- [Service Documentation](./FE/src/services/) - API service files

### Testing
- [Postman Guide](./POSTMAN_TESTING_GUIDE.md) - Test API với Postman
- [Setup Guide](./SETUP_GUIDE.md) - Troubleshooting

---

## 🔧 Development

### Backend Development

```bash
cd apps/api
npm run dev  # Auto-reload với nodemon
```

### Frontend Development

```bash
cd FE
npm run dev  # Vite dev server với hot reload
```

### Database

```bash
# MongoDB shell
mongosh quizme

# Reset database
use quizme
db.dropDatabase()

# Seed lại
cd apps/api
npm run seed
```

---

## ✅ Checklist

### Setup
- [ ] Node.js installed
- [ ] MongoDB installed và running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Environment variables configured
- [ ] Database seeded (optional)

### Testing
- [ ] Backend health check works
- [ ] Frontend connects to backend
- [ ] Authentication works
- [ ] API endpoints tested

### Integration
- [ ] Services configured
- [ ] Components use services
- [ ] Error handling implemented
- [ ] Loading states added

---

## 🐛 Troubleshooting

### Common Issues

**Backend không chạy:**
- Kiểm tra MongoDB đang chạy
- Kiểm tra PORT không bị conflict
- Kiểm tra `.env` file

**Frontend không kết nối backend:**
- Kiểm tra `VITE_API_URL` trong `.env`
- Kiểm tra CORS settings
- Kiểm tra backend đang chạy

**401 Unauthorized:**
- Token hết hạn, thử login lại
- Kiểm tra token trong localStorage

**Xem thêm:** [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)

---

## 📝 Notes

- Backend tự động thêm XP, cập nhật streak và missions khi user submit exam
- Achievements tự động unlock khi đạt điều kiện
- Token được lưu trong localStorage và tự động inject vào requests

---

## 🚀 Production

### Backend
```bash
cd apps/api
NODE_ENV=production npm start
```

### Frontend
```bash
cd FE
npm run build
# Serve build/ folder với nginx hoặc static hosting
```

---

## 📄 License

MIT

---

## 👥 Contributors

QuizMe Team

---

**Happy Coding! 🎉**

