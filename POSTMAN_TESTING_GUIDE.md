# 🧪 Hướng dẫn Test API với Postman

## 📋 Mục lục
1. [Setup Postman](#setup-postman)
2. [Cấu hình Environment](#cấu-hình-environment)
3. [Test Authentication](#test-authentication)
4. [Test User Endpoints](#test-user-endpoints)
5. [Test Missions](#test-missions)
6. [Test XP & Level](#test-xp--level)
7. [Test Streak](#test-streak)
8. [Test Achievements](#test-achievements)
9. [Test Leaderboard](#test-leaderboard)
10. [Test Exam Flow](#test-exam-flow)

---

## 🔧 Setup Postman

### 1. Tạo Environment

1. Mở Postman
2. Click vào **Environments** (bên trái)
3. Click **+** để tạo environment mới
4. Đặt tên: `QuizMe API - Local`
5. Thêm các variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000/api` | `http://localhost:5000/api` |
| `token` | (để trống) | (sẽ được set tự động) |

### 2. Tạo Collection

1. Click **Collections** → **+ New Collection**
2. Đặt tên: `QuizMe API`
3. Thêm folder structure:
   - `Authentication`
   - `Users`
   - `Missions`
   - `XP & Level`
   - `Streak`
   - `Achievements`
   - `Leaderboard`
   - `Exams`

---

## 🔐 Test Authentication

### 1. Register (Đăng ký)

**Request:**
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "fullName": "Nguyễn Văn A",
  "email": "test@example.com",
  "password": "123456",
  "studentId": "01000071",
  "grade": "12",
  "className": "12A1"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "Nguyễn Văn A",
    "email": "test@example.com",
    "role": "student"
  }
}
```

**Postman Script (Tests tab):**
```javascript
if (pm.response.code === 201 || pm.response.code === 200) {
    const jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("token", jsonData.token);
        console.log("Token saved:", jsonData.token);
    }
}
```

### 2. Login (Đăng nhập)

**Request:**
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

**Postman Script (Tests tab):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("token", jsonData.token);
    }
}
```

### 3. Get Me (Lấy thông tin user hiện tại)

**Request:**
```
GET {{base_url}}/auth/me
Authorization: Bearer {{token}}
```

---

## 👤 Test User Endpoints

### 1. Get User Stats (XP & Level)

**Request:**
```
GET {{base_url}}/users/me/xp
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "xp": 150,
    "level": 2,
    "xpForCurrentLevel": 100,
    "xpForNextLevel": 400,
    "xpNeeded": 250,
    "xpProgress": 50,
    "xpRequired": 300,
    "progressPercent": 16.67
  }
}
```

### 2. Get Streak Info

**Request:**
```
GET {{base_url}}/users/me/streak
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "currentStreak": 3,
    "longestStreak": 3,
    "lastCheckIn": "2024-01-15T10:00:00.000Z",
    "canCheckInToday": false
  }
}
```

### 3. Check-in Streak

**Request:**
```
POST {{base_url}}/users/me/streak/checkin
Authorization: Bearer {{token}}
```

### 4. Get XP History

**Request:**
```
GET {{base_url}}/users/me/xp/history?page=1&limit=20
Authorization: Bearer {{token}}
```

### 5. Get User Achievements

**Request:**
```
GET {{base_url}}/users/me/achievements
Authorization: Bearer {{token}}
```

---

## 📅 Test Missions

### 1. Get Daily Missions

**Request:**
```
GET {{base_url}}/missions/daily
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "type": "complete_exam",
      "title": "Hoàn thành 1 đề thi",
      "description": "Làm và nộp bài 1 đề thi bất kỳ",
      "target": 1,
      "progress": 0,
      "reward": {
        "xp": 50,
        "coins": 10
      },
      "completed": false
    }
  ]
}
```

### 2. Update Mission Progress

**Request:**
```
PATCH {{base_url}}/missions/{{mission_id}}/progress
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "progress": 1
}
```

### 3. Complete Mission

**Request:**
```
POST {{base_url}}/missions/{{mission_id}}/complete
Authorization: Bearer {{token}}
```

---

## 🎯 Test XP & Level

### 1. Add XP

**Request:**
```
POST {{base_url}}/users/me/xp/add
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "amount": 50,
  "source": "other",
  "description": "Test XP"
}
```

### 2. Get Levels Config

**Request:**
```
GET {{base_url}}/config/levels
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "level": 1,
      "xpRequired": 100,
      "xpForLevel": 0,
      "xpForNextLevel": 100
    },
    {
      "level": 2,
      "xpRequired": 300,
      "xpForLevel": 100,
      "xpForNextLevel": 400
    }
  ]
}
```

---

## 🏆 Test Achievements

### 1. Get All Achievements

**Request:**
```
GET {{base_url}}/achievements
```

### 2. Get Achievement Progress

**Request:**
```
GET {{base_url}}/achievements/progress
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "achievement": {
          "_id": "...",
          "name": "First Exam",
          "icon": "🎯",
          "description": "Hoàn thành đề thi đầu tiên",
          "rarity": "common"
        },
        "isUnlocked": false,
        "progress": 0,
        "target": 1,
        "completed": false
      }
    ],
    "summary": {
      "unlocked": 0,
      "total": 10,
      "percentage": 0
    }
  }
}
```

### 3. Unlock Achievement (Manual)

**Request:**
```
POST {{base_url}}/achievements/{{achievement_id}}/unlock
Authorization: Bearer {{token}}
```

---

## 📊 Test Leaderboard

### 1. Get Weekly Leaderboard

**Request:**
```
GET {{base_url}}/leaderboard/weekly?page=1&limit=50
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "user": {
        "id": "...",
        "fullName": "Nguyễn Văn A",
        "email": "test@example.com",
        "avatar": null,
        "level": 5,
        "xp": 2500
      },
      "weeklyScore": 450,
      "correctAnswers": 45,
      "examsCompleted": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

### 2. Get Monthly Leaderboard

**Request:**
```
GET {{base_url}}/leaderboard/monthly?page=1&limit=50
```

### 3. Get All-Time Leaderboard

**Request:**
```
GET {{base_url}}/leaderboard/alltime?page=1&limit=50
```

### 4. Get Friends Leaderboard

**Request:**
```
GET {{base_url}}/leaderboard/friends
Authorization: Bearer {{token}}
```

---

## 📝 Test Exam Flow

### 1. Start Exam

**Request:**
```
POST {{base_url}}/exam-attempts/start
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "examId": "{{exam_id}}"
}
```

### 2. Save Answer

**Request:**
```
PUT {{base_url}}/exam-attempts/{{attempt_id}}/answer
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "questionId": "{{question_id}}",
  "answer": "A"
}
```

### 3. Submit Exam

**Request:**
```
POST {{base_url}}/exam-attempts/{{attempt_id}}/submit
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "score": 8.5,
    "correctAnswers": 17,
    "totalQuestions": 20,
    "timeSpent": 1800
  },
  "result": {
    "score": "8.50",
    "correctAnswers": 17,
    "totalQuestions": 20,
    "timeSpent": 1800
  }
}
```

**Lưu ý:** Sau khi submit, hệ thống sẽ tự động:
- Tính và thêm XP
- Cập nhật streak
- Cập nhật mission progress
- Kiểm tra và unlock achievements

### 4. Get Attempt Analysis

**Request:**
```
GET {{base_url}}/exam-attempts/{{attempt_id}}/analysis
Authorization: Bearer {{token}}
```

### 5. Get My Performance

**Request:**
```
GET {{base_url}}/exam-attempts/my-performance
Authorization: Bearer {{token}}
```

---

## 🔄 Setup Authorization Header (Tự động)

Tạo **Pre-request Script** cho Collection:

1. Vào Collection settings
2. Tab **Authorization**
3. Type: **Bearer Token**
4. Token: `{{token}}`

Hoặc thêm vào **Pre-request Script** của Collection:

```javascript
const token = pm.environment.get("token");
if (token) {
    pm.request.headers.add({
        key: "Authorization",
        value: `Bearer ${token}`
    });
}
```

---

## 📦 Import Postman Collection

Bạn có thể tạo file JSON collection và import vào Postman:

1. Tạo file `QuizMe_API.postman_collection.json`
2. Import vào Postman: **Import** → Chọn file
3. Import environment: **Import** → Chọn file environment

---

## ✅ Checklist Test

- [ ] Authentication (Register, Login, Get Me)
- [ ] User Stats (XP, Level, Streak)
- [ ] Daily Missions (Get, Update Progress, Complete)
- [ ] XP System (Add XP, Get History, Get Config)
- [ ] Achievements (Get All, Get Progress, Unlock)
- [ ] Leaderboard (Weekly, Monthly, All-time, Friends)
- [ ] Exam Flow (Start, Save Answer, Submit)
- [ ] Auto XP/Streak/Mission update after exam submit

---

## 🐛 Troubleshooting

### 401 Unauthorized
- Kiểm tra token có được set trong environment không
- Kiểm tra token có hết hạn không (thử login lại)

### 404 Not Found
- Kiểm tra base_url đúng chưa
- Kiểm tra endpoint path đúng chưa

### 500 Server Error
- Kiểm tra MongoDB đang chạy không
- Kiểm tra server logs để xem lỗi chi tiết

### CORS Error
- Đảm bảo backend đã cấu hình CORS đúng
- Kiểm tra `FRONTEND_URL` trong `.env` của backend

---

## 📚 Tài liệu tham khảo

- [Postman Documentation](https://learning.postman.com/docs/)
- [API Documentation](./apps/api/README.md)

