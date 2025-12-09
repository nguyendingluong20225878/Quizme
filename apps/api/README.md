# QuizMe Backend API

Backend API cho ứng dụng QuizMe - Nền tảng học tập và thi trắc nghiệm Toán học.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Endpoints](#api-endpoints)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Models](#models)

## 🎯 Giới thiệu

Backend API được xây dựng theo mô hình MVC (Model-View-Controller) sử dụng:
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database và ODM
- **JWT** - Xác thực người dùng
- **bcryptjs** - Mã hóa mật khẩu

API cung cấp đầy đủ các endpoints để:
- Đăng ký/Đăng nhập người dùng
- Quản lý đề thi và câu hỏi
- Làm bài thi và lưu kết quả
- Quản lý chuyên đề, công thức, video bài giảng
- Theo dõi năng lực và thành tích người dùng

## 🛠 Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **JWT** - JSON Web Token cho authentication
- **bcryptjs** - Mã hóa mật khẩu
- **dotenv** - Quản lý biến môi trường
- **cors** - CORS middleware
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **express-validator** - Validation middleware
- **nodemon** - Development server với auto-reload

## 📦 Cài đặt

### Yêu cầu

- Node.js >= 14.0.0
- MongoDB >= 4.4
- npm hoặc pnpm

### Bước 1: Clone repository

```bash
cd apps/api
```

### Bước 2: Cài đặt dependencies

```bash
npm install
# hoặc
pnpm install
```

### Bước 3: Tạo file .env

Copy file `.env.example` và đổi tên thành `.env`:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa các giá trị trong file `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/quizme
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Bước 4: Đảm bảo MongoDB đang chạy

```bash
# Khởi động MongoDB (nếu chưa chạy)
# macOS/Linux:
sudo service mongod start
# hoặc
mongod

# Windows:
net start MongoDB
```

## 🚀 Chạy ứng dụng

### Development mode (với nodemon)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

### Seed dữ liệu mẫu

```bash
npm run seed
```

Sau khi seed, bạn sẽ có:
- 1 user test: `test@example.com` / `123456`
- Các subjects, topics, questions, exams, formulas, videos mẫu

Server sẽ chạy tại: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | ✅ |

### Users

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/users` | Lấy danh sách users | ✅ |
| GET | `/api/users/:id` | Lấy thông tin user | ✅ |
| PUT | `/api/users/:id` | Cập nhật user | ✅ |
| DELETE | `/api/users/:id` | Xóa user | ✅ Admin |
| GET | `/api/users/me/streak` | Lấy thông tin streak | ✅ |
| POST | `/api/users/me/streak/checkin` | Check-in streak | ✅ |
| GET | `/api/users/me/xp` | Lấy thông tin XP và Level | ✅ |
| POST | `/api/users/me/xp/add` | Thêm XP | ✅ |
| GET | `/api/users/me/xp/history` | Lấy lịch sử XP | ✅ |
| GET | `/api/users/me/achievements` | Lấy achievements của user | ✅ |

### Subjects

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/subjects` | Lấy danh sách môn học | ❌ |
| GET | `/api/subjects/:id` | Lấy thông tin môn học | ❌ |
| POST | `/api/subjects` | Tạo môn học mới | ✅ Admin |
| PUT | `/api/subjects/:id` | Cập nhật môn học | ✅ Admin |
| DELETE | `/api/subjects/:id` | Xóa môn học | ✅ Admin |

### Exams

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/exams` | Lấy danh sách đề thi | ❌ |
| GET | `/api/exams/:id` | Lấy thông tin đề thi | ❌ |
| POST | `/api/exams` | Tạo đề thi mới | ✅ Admin |
| POST | `/api/exams/factory` | Tạo đề thi tùy chỉnh | ✅ |
| PUT | `/api/exams/:id` | Cập nhật đề thi | ✅ Admin |
| DELETE | `/api/exams/:id` | Xóa đề thi | ✅ Admin |

### Questions

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/questions` | Lấy danh sách câu hỏi | ❌ |
| GET | `/api/questions/:id` | Lấy thông tin câu hỏi | ❌ |
| POST | `/api/questions` | Tạo câu hỏi mới | ✅ Admin |
| PUT | `/api/questions/:id` | Cập nhật câu hỏi | ✅ Admin |
| DELETE | `/api/questions/:id` | Xóa câu hỏi | ✅ Admin |

### Exam Attempts

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/exam-attempts/start` | Bắt đầu làm bài | ✅ |
| GET | `/api/exam-attempts` | Lấy lịch sử làm bài | ✅ |
| PUT | `/api/exam-attempts/:id/answer` | Lưu câu trả lời | ✅ |
| POST | `/api/exam-attempts/:id/submit` | Nộp bài thi | ✅ |
| GET | `/api/exam-attempts/:id` | Lấy chi tiết kết quả | ✅ |

### Topics

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/topics` | Lấy danh sách chuyên đề | ❌ |
| GET | `/api/topics/:id` | Lấy thông tin chuyên đề | ❌ |
| POST | `/api/topics` | Tạo chuyên đề mới | ✅ Admin |
| PUT | `/api/topics/:id` | Cập nhật chuyên đề | ✅ Admin |
| DELETE | `/api/topics/:id` | Xóa chuyên đề | ✅ Admin |

### Formulas

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/formulas` | Lấy danh sách công thức | ❌ |
| GET | `/api/formulas/:id` | Lấy thông tin công thức | ❌ |
| POST | `/api/formulas` | Tạo công thức mới | ✅ Admin |
| PUT | `/api/formulas/:id` | Cập nhật công thức | ✅ Admin |
| DELETE | `/api/formulas/:id` | Xóa công thức | ✅ Admin |

### Videos

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/videos` | Lấy danh sách video | ❌ |
| GET | `/api/videos/:id` | Lấy thông tin video | ❌ |
| POST | `/api/videos` | Tạo video mới | ✅ Admin |
| PUT | `/api/videos/:id` | Cập nhật video | ✅ Admin |
| DELETE | `/api/videos/:id` | Xóa video | ✅ Admin |

### Competencies

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/competencies` | Lấy năng lực của user | ✅ |
| PUT | `/api/competencies/:topicId` | Cập nhật năng lực | ✅ |

### Tips

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/tips` | Lấy danh sách bí kíp | ❌ |
| GET | `/api/tips/:id` | Lấy thông tin bí kíp | ❌ |
| POST | `/api/tips/:id/save` | Lưu bí kíp | ✅ |
| POST | `/api/tips` | Tạo bí kíp mới | ✅ Admin |
| PUT | `/api/tips/:id` | Cập nhật bí kíp | ✅ Admin |
| DELETE | `/api/tips/:id` | Xóa bí kíp | ✅ Admin |

### Missions (Daily Missions)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/missions/daily` | Lấy missions hàng ngày | ✅ |
| PATCH | `/api/missions/:id/progress` | Cập nhật progress mission | ✅ |
| POST | `/api/missions/:id/complete` | Hoàn thành mission | ✅ |

### Achievements

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/achievements` | Lấy danh sách achievements | ❌ |
| GET | `/api/achievements/progress` | Lấy progress achievements | ✅ |
| POST | `/api/achievements/:id/unlock` | Unlock achievement | ✅ |

### Leaderboard

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/leaderboard/weekly` | Leaderboard tuần | ❌ |
| GET | `/api/leaderboard/monthly` | Leaderboard tháng | ❌ |
| GET | `/api/leaderboard/alltime` | Leaderboard all-time | ❌ |
| GET | `/api/leaderboard/friends` | Leaderboard bạn bè | ✅ |

### Config

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/config/levels` | Lấy cấu hình levels | ❌ |

### Health Check

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra trạng thái server |

## 📁 Cấu trúc dự án

```
apps/api/
├── src/
│   ├── config/          # Cấu hình (database, cors, etc.)
│   │   ├── database.js
│   │   └── cors.js
│   ├── controllers/     # Xử lý logic nghiệp vụ
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── examController.js
│   │   ├── questionController.js
│   │   └── ...
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Exam.js
│   │   ├── Question.js
│   │   └── ...
│   ├── routes/          # Route definitions
│   │   ├── auth.js
│   │   ├── exams.js
│   │   └── ...
│   ├── middleware/      # Middleware (auth, error handling)
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/           # Utility functions
│   │   ├── logger.js
│   │   └── seed.js
│   └── app.js           # Express app entry point
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## 📊 Models

### User
- Thông tin người dùng (học sinh, giáo viên, admin)
- Authentication và authorization
- Thông tin profile, streak, achievements, xp, level

### Subject
- Môn học (Toán, Lý, Hóa, etc.)

### Topic
- Chuyên đề kiến thức trong mỗi môn học

### Exam
- Đề thi/kiểm tra
- Chứa danh sách questions

### Question
- Câu hỏi (multiple-choice, true-false, essay)
- Thuộc topic và subject

### ExamAttempt
- Kết quả làm bài thi của user
- Lưu answers, score, timeSpent

### Formula
- Công thức toán học
- Thuộc topic và subject

### Video
- Video bài giảng
- Thuộc topic và subject

### Achievement
- Thành tích/huy hiệu

### Mission
- Nhiệm vụ hàng ngày của người dùng
- Các loại: complete_exam, complete_questions, study_time, streak, score_goal

### XPHistory
- Lịch sử tích lũy XP của người dùng
- Lưu lại nguồn gốc XP (exam, mission, achievement, etc.)

### Competency
- Năng lực/điểm số theo chuyên đề của user

### Tip
- Bí kíp/thủ thuật học tập

## 🔐 Authentication

API sử dụng JWT (JSON Web Token) để xác thực. Sau khi đăng nhập thành công, bạn sẽ nhận được token. Gửi token trong header:

```
Authorization: Bearer <your-token>
```

## 📝 Request/Response Examples

### Đăng ký

**Request:**
```json
POST /api/auth/register
{
  "fullName": "Nguyễn Văn A",
  "email": "test@example.com",
  "password": "123456",
  "studentId": "01000071",
  "grade": "12",
  "className": "12A1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "Nguyễn Văn A",
    "email": "test@example.com",
    "role": "student"
  }
}
```

### Làm bài thi

**Request:**
```json
POST /api/exam-attempts/start
{
  "examId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "exam": "507f1f77bcf86cd799439011",
    "status": "in-progress",
    "startedAt": "2024-01-01T10:00:00.000Z"
  },
  "exam": {
    "title": "ĐỀ THI TỐT NGHIỆP THPT 2024",
    "duration": 90,
    "questions": [...]
  }
}
```

## 🐛 Troubleshooting

### MongoDB connection error

Đảm bảo MongoDB đang chạy và `MONGO_URI` trong file `.env` đúng.

### Port already in use

Thay đổi `PORT` trong file `.env` hoặc dừng ứng dụng đang chạy trên port đó.

### JWT token invalid

Kiểm tra `JWT_SECRET` trong file `.env` và đảm bảo token được gửi đúng format trong header.

## 📄 License

MIT

## 👨‍💻 Tác giả

QuizMe Team

