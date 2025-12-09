# 🚀 Hướng dẫn Setup và Chạy Project QuizMe

## 📋 Mục lục
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Setup Backend](#setup-backend)
3. [Setup Frontend](#setup-frontend)
4. [Chạy Project](#chạy-project)
5. [Troubleshooting](#troubleshooting)

---

## 💻 Yêu cầu hệ thống

- **Node.js**: >= 14.0.0 (khuyến nghị >= 18.0.0)
- **MongoDB**: >= 4.4
- **npm** hoặc **pnpm** hoặc **yarn**
- **Git**

---

## 🔧 Setup Backend

### Bước 1: Di chuyển vào thư mục Backend

```bash
cd apps/api
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
# hoặc
pnpm install
# hoặc
yarn install
```

### Bước 3: Cấu hình Environment Variables

Tạo file `.env` trong thư mục `apps/api/`:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/quizme

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

**Lưu ý:**
- Thay đổi `JWT_SECRET` thành một chuỗi bí mật mạnh trong production
- Đảm bảo `MONGO_URI` đúng với MongoDB của bạn
- `FRONTEND_URL` phải khớp với URL frontend

### Bước 4: Khởi động MongoDB

**Windows:**
```bash
# Nếu đã cài MongoDB Service
net start MongoDB

# Hoặc chạy MongoDB manually
mongod
```

**macOS (với Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
# hoặc
sudo service mongod start
```

### Bước 5: Seed dữ liệu mẫu (Tùy chọn)

```bash
npm run seed
```

Sau khi seed, bạn sẽ có:
- 1 user test: `test@example.com` / `123456`
- Các subjects, topics, questions, exams, formulas mẫu

### Bước 6: Chạy Backend

**Development mode (với auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

Kiểm tra health check:
```bash
curl http://localhost:5000/api/health
```

---

## 🎨 Setup Frontend

### Bước 1: Di chuyển vào thư mục Frontend

```bash
cd FE
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
# hoặc
pnpm install
# hoặc
yarn install
```

### Bước 3: Cấu hình Environment Variables

Tạo file `.env` trong thư mục `FE/`:

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api
```

**Lưu ý:** 
- Vite sử dụng prefix `VITE_` cho environment variables
- Nếu không set, sẽ dùng default: `http://localhost:5000/api`

### Bước 4: Chạy Frontend

**Development mode:**
```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

**Build production:**
```bash
npm run build
```

---

## 🏃 Chạy Project

### Cách 1: Chạy riêng lẻ (Khuyến nghị cho development)

**Terminal 1 - Backend:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd FE
npm run dev
```

### Cách 2: Sử dụng npm scripts (nếu có)

Tạo file `package.json` ở root:

```json
{
  "name": "quizme",
  "version": "1.0.0",
  "scripts": {
    "dev:api": "cd apps/api && npm run dev",
    "dev:fe": "cd FE && npm run dev",
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:fe\"",
    "install:all": "cd apps/api && npm install && cd ../../FE && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Sau đó chạy:
```bash
npm run dev
```

---

## ✅ Kiểm tra Setup

### 1. Kiểm tra Backend

Mở browser: `http://localhost:5000/api/health`

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### 2. Kiểm tra Frontend

Mở browser: `http://localhost:3000`

### 3. Test API Connection

Trong Frontend console, kiểm tra:
- Không có CORS errors
- API calls thành công

---

## 🔍 Troubleshooting

### Backend không chạy được

**Lỗi: Port 5000 đã được sử dụng**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

Hoặc thay đổi PORT trong `.env`:
```env
PORT=5001
```

**Lỗi: MongoDB connection failed**
- Kiểm tra MongoDB đang chạy: `mongosh` hoặc `mongo`
- Kiểm tra `MONGO_URI` trong `.env`
- Kiểm tra firewall settings

**Lỗi: Module not found**
```bash
cd apps/api
rm -rf node_modules package-lock.json
npm install
```

### Frontend không kết nối được Backend

**Lỗi: CORS Error**
- Kiểm tra `FRONTEND_URL` trong backend `.env`
- Đảm bảo `http://localhost:3000` được thêm vào CORS whitelist

**Lỗi: Network Error / Connection Refused**
- Kiểm tra backend đang chạy không
- Kiểm tra `VITE_API_URL` trong frontend `.env`
- Kiểm tra firewall/antivirus

**Lỗi: 401 Unauthorized**
- Token có thể đã hết hạn
- Thử login lại
- Kiểm tra token trong localStorage

### MongoDB Issues

**Lỗi: Cannot connect to MongoDB**
```bash
# Kiểm tra MongoDB service
# Windows
net start MongoDB

# macOS
brew services list

# Linux
sudo systemctl status mongod
```

**Lỗi: Database not found**
- MongoDB sẽ tự động tạo database khi lần đầu connect
- Hoặc tạo database manually: `mongosh` → `use quizme`

---

## 📝 Development Tips

### 1. Hot Reload

- Backend: Sử dụng `nodemon` (đã có trong `npm run dev`)
- Frontend: Vite tự động hot reload

### 2. Debugging

**Backend:**
- Sử dụng `console.log()` hoặc debugger
- Xem logs trong terminal

**Frontend:**
- Sử dụng React DevTools
- Xem Network tab trong Browser DevTools
- Check Console cho errors

### 3. Database Management

**Xem dữ liệu:**
```bash
mongosh quizme
```

**Reset database:**
```bash
mongosh
use quizme
db.dropDatabase()
```

Sau đó chạy seed lại:
```bash
cd apps/api
npm run seed
```

---

## 🚀 Production Deployment

### Backend

1. Set `NODE_ENV=production` trong `.env`
2. Thay đổi `JWT_SECRET` thành secret mạnh
3. Cấu hình MongoDB production URI
4. Build và chạy:
```bash
npm start
```

### Frontend

1. Build:
```bash
npm run build
```

2. Serve với nginx hoặc static hosting:
```bash
# Serve build folder
npx serve -s build
```

---

## 📚 Tài liệu tham khảo

- [Backend API Documentation](./apps/api/README.md)
- [Postman Testing Guide](./POSTMAN_TESTING_GUIDE.md)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🆘 Cần hỗ trợ?

Nếu gặp vấn đề:
1. Kiểm tra logs trong terminal
2. Kiểm tra browser console
3. Xem lại các bước setup
4. Kiểm tra environment variables

