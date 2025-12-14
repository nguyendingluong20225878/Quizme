# Quick Start Testing Guide

## 🚀 Khởi động nhanh

### 1. Backend
```bash
cd apps/api
npm install
npm start
# Server chạy tại http://localhost:5000
```

### 2. Frontend
```bash
cd FE
npm install
npm run dev
# Frontend chạy tại http://localhost:5173
```

## 📝 Test nhanh với Postman/Thunder Client

### Bước 1: Đăng ký và Đăng nhập

**POST** `http://localhost:5000/api/auth/register`
```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

**POST** `http://localhost:5000/api/auth/login`
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Lưu token từ response** → Set vào variable `token` trong Postman

### Bước 2: Test các API chính

#### Dashboard
**GET** `http://localhost:5000/api/dashboard`
- Header: `Authorization: Bearer {{token}}`

#### Onboarding
**GET** `http://localhost:5000/api/onboarding/goals`
**GET** `http://localhost:5000/api/onboarding/subjects`

#### Streak
**GET** `http://localhost:5000/api/streak`
- Header: `Authorization: Bearer {{token}}`

#### Exam Room
**GET** `http://localhost:5000/api/exam-room/modes`
- Header: `Authorization: Bearer {{token}}`

#### Challenge 5 Min
**GET** `http://localhost:5000/api/challenge-5min/status`
- Header: `Authorization: Bearer {{token}}`

#### Golden Time
**GET** `http://localhost:5000/api/golden-time/cards`
- Header: `Authorization: Bearer {{token}}`

#### Analytics
**GET** `http://localhost:5000/api/analytics/overview`
- Header: `Authorization: Bearer {{token}}`

#### Profile
**GET** `http://localhost:5000/api/profile`
- Header: `Authorization: Bearer {{token}}`

#### Leaderboard
**GET** `http://localhost:5000/api/leaderboard?mode=weekly`
- Header: `Authorization: Bearer {{token}}`

## 🧪 Test trong Browser Console

Mở browser console tại frontend và chạy:

```javascript
// Test login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: '123456'
  })
});
const data = await response.json();
console.log('Login:', data);
localStorage.setItem('quizme_token', data.token);

// Test dashboard
const token = localStorage.getItem('quizme_token');
const dashResponse = await fetch('http://localhost:5000/api/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const dashData = await dashResponse.json();
console.log('Dashboard:', dashData);
```

## ✅ Checklist nhanh

- [ ] Backend server chạy được
- [ ] Frontend dev server chạy được
- [ ] Đăng ký thành công
- [ ] Đăng nhập và nhận token
- [ ] Gọi được ít nhất 3 API protected
- [ ] Frontend services import được
- [ ] Không có lỗi CORS
- [ ] Token được lưu vào localStorage

## 🐛 Troubleshooting

### Backend không chạy
- Check MongoDB đang chạy
- Check PORT không bị chiếm
- Check `.env` file có đúng không

### Frontend không kết nối được API
- Check API base URL trong `FE/src/services/api.ts`
- Check CORS settings trong backend
- Check network tab trong DevTools

### 401 Unauthorized
- Check token có hợp lệ không
- Check token có được gửi trong header không
- Thử login lại để lấy token mới

### 404 Not Found
- Check route path có đúng không
- Check server có đang chạy không
- Check route có được register trong `app.js` không

## 📚 Tài liệu chi tiết

- Backend: Xem `apps/api/TESTING_GUIDE.md`
- Frontend: Xem `FE/TESTING_GUIDE.md`

