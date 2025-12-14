# Hướng Dẫn Test Các Trang Frontend và Verify Dữ Liệu từ DB

## 🎯 Mục tiêu
- Test các trang FE đã triển khai
- Phân biệt dữ liệu thật từ DB vs mock data
- Verify dữ liệu từ DB đã được hiển thị đúng trên FE

## 📋 Checklist Các Trang Cần Test

### 1. Authentication Pages
- [ ] `/login` - Trang đăng nhập
  - **API:** `POST /api/auth/login`
- [ ] `/register` - Trang đăng ký
  - **API:** `POST /api/auth/register`
- [ ] `/forgot-password` - Quên mật khẩu
  - **API:** `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`

### 2. Onboarding Pages
- [ ] `/goal-selection` - Chọn mục tiêu (Bước 1/3)
  - **API:** `GET /api/onboarding/goals`, `POST /api/onboarding/complete`
- [ ] `/subject-selection` - Chọn môn học (Bước 2/3)
  - **API:** `GET /api/onboarding/subjects`, `POST /api/onboarding/complete`
- [ ] `/placement-test` - Bài test xếp lớp (Bước 3/3)
  - **API:** `GET /api/onboarding/placement-test`, `POST /api/onboarding/placement-test/submit`

### 3. Dashboard
- [ ] `/dashboard` - Trang dashboard chính
  - **API:** `GET /api/dashboard`, `GET /api/dashboard/daily-missions`, `GET /api/dashboard/stats`

### 4. Exam Room
- [ ] `/exam-room` - Phòng thi (Lobby)
  - **API:** `GET /api/exam-room/modes`
- [ ] `/exam-room/sprint` - Sprint mode
  - **API:** `POST /api/exam-room/start`, `POST /api/exam-room/submit`
- [ ] `/exam-room/marathon` - Marathon mode
  - **API:** `POST /api/exam-room/start`, `POST /api/exam-room/submit`
- [ ] `/exam-room/ranking` - Ranking mode
  - **API:** `POST /api/exam-room/start`, `POST /api/exam-room/submit`

### 5. Challenge 5 Min
- [ ] `/challenge-5min` - Challenge 5 phút
  - **API:** `GET /api/challenge-5min/status`, `POST /api/challenge-5min/start`, `POST /api/challenge-5min/submit-answer`, `POST /api/challenge-5min/complete`

### 6. Golden Time
- [ ] `/golden-time` - Flashcard review
  - **API:** `GET /api/golden-time/cards`, `POST /api/golden-time/start-session`, `POST /api/golden-time/review`, `POST /api/golden-time/complete-session`

### 7. Learning Roadmap
- [ ] `/roadmap` - Lộ trình học tập
  - **API:** `GET /api/roadmap`, `GET /api/roadmap/stages/:stageId`, `POST /api/roadmap/stages/:stageId/progress`, `POST /api/roadmap/stages/:stageId/boss/complete`

### 8. Analytics
- [ ] `/analytics` - Phân tích
  - **API:** `GET /api/analytics/overview`, `GET /api/analytics/subjects/:subject`, `GET /api/analytics/progress`

### 9. Profile
- [ ] `/profile` - Hồ sơ cá nhân
  - **API:** `GET /api/profile`, `PUT /api/users/me`, `POST /api/profile/avatar`

### 10. Leaderboard
- [ ] `/leaderboard` - Bảng xếp hạng
  - **API:** `GET /api/leaderboard?mode=weekly|monthly|alltime`, `GET /api/leaderboard/my-rank`

### 11. Test Library
- [ ] `/test-library` - Thư viện đề thi
  - **API:** `GET /api/tests/library`, `POST /api/tests/custom/create`, `GET /api/tests/:testId`

## 🔍 Cách Phân Biệt Dữ Liệu Thật vs Mock

### 1. Kiểm Tra Network Tab (DevTools)

**Bước 1: Mở DevTools**
- Nhấn `F12` hoặc `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Chuyển sang tab **Network**

**Bước 2: Reload trang và quan sát**

✅ **Dữ liệu THẬT từ DB:**
- Có request đến API: `http://localhost:5000/api/...`
- Status code: `200`, `201`
- Response có dữ liệu từ server
- Request có header `Authorization: Bearer ...`

❌ **Dữ liệu MOCK:**
- Không có request đến API
- Hoặc request bị fail (404, 500)
- Dữ liệu hardcode trong component
- Console có log "Using mock data"

**Ví dụ kiểm tra:**

```javascript
// Trong Network tab, tìm request đến:
GET http://localhost:5000/api/dashboard
Status: 200 OK
Response: { challenge5MinCompleted: false, dailyMissions: [...], stats: {...} }
→ Đây là dữ liệu THẬT từ DB
```

### 2. Kiểm Tra Console Logs

**Mở Console tab trong DevTools:**

✅ **Dữ liệu THẬT:**
```javascript
// Console sẽ có logs như:
"Fetching dashboard from API..."
"Dashboard data received: { ... }"
"API call successful"
```

❌ **Dữ liệu MOCK:**
```javascript
// Console sẽ có logs như:
"Using mock data"
"API unavailable, using fallback data"
"Mock dashboard data"
```

### 3. Kiểm Tra Source Code

**Tìm trong component:**

✅ **Dữ liệu THẬT:**
```typescript
// Component gọi API service
import { dashboardService } from '@/services';

useEffect(() => {
  const fetchData = async () => {
    const data = await dashboardService.getDashboard(); // ← Gọi API
    setDashboard(data);
  };
  fetchData();
}, []);
```

❌ **Dữ liệu MOCK:**
```typescript
// Component dùng hardcode data
const mockData = {
  stats: { studyStreak: 5, todayXP: 100 }
};
setDashboard(mockData); // ← Không gọi API
```

### 4. Kiểm Tra Response Data

**Trong Network tab, click vào request → Preview/Response:**

✅ **Dữ liệu THẬT từ DB:**
```json
{
  "success": true,
  "challenge5MinCompleted": false,
  "dailyMissions": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",  // ← MongoDB ObjectId
      "title": "Hoàn thành Challenge 5 phút",
      "completed": false,
      "progress": 0,
      "total": 1,
      "xp": 50
    }
  ],
  "stats": {
    "studyStreak": 3,
    "todayXP": 150,
    "weeklyProgress": 500,
    "totalXP": 2500
  }
}
```

❌ **Dữ liệu MOCK:**
```json
{
  "challenge5MinCompleted": false,
  "dailyMissions": [
    {
      "id": "mission-1",  // ← ID giả
      "title": "Mock Mission",
      "completed": false
    }
  ],
  "stats": {
    "studyStreak": 0,
    "todayXP": 0,
    "weeklyProgress": 0,
    "totalXP": 0
  }
}
```

## 🧪 Test Từng Trang Cụ Thể

### Test Dashboard Page

**1. Mở trang Dashboard:**
```
http://localhost:5173/dashboard
```

**2. Kiểm tra Network:**
- Tìm request: `GET /api/dashboard`
- Status phải là `200`
- Response phải có dữ liệu

**3. Verify dữ liệu hiển thị:**
```javascript
// Trong Console, chạy:
const checkDashboard = async () => {
  const token = localStorage.getItem('quizme_token');
  const response = await fetch('http://localhost:5000/api/dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log('Dashboard từ DB:', data);
  
  // So sánh với dữ liệu trên UI
  const streakElement = document.querySelector('[data-testid="streak"]');
  console.log('Streak trên UI:', streakElement?.textContent);
  console.log('Streak từ DB:', data.stats?.studyStreak);
};
checkDashboard();
```

**4. Kiểm tra dữ liệu có thay đổi:**
- Hoàn thành một activity (ví dụ: làm challenge)
- Reload trang
- Kiểm tra dữ liệu có cập nhật không

### Test Profile Page

**1. Mở trang Profile:**
```
http://localhost:5000/profile
```

**2. Verify dữ liệu user:**
```javascript
// Trong Console:
const checkProfile = async () => {
  const token = localStorage.getItem('quizme_token');
  
  // Lấy từ API
  const apiResponse = await fetch('http://localhost:5000/api/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const apiData = await apiResponse.json();
  console.log('Profile từ DB:', apiData);
  
  // Lấy từ localStorage (nếu có)
  const localData = localStorage.getItem('quizme_user');
  console.log('Profile từ localStorage:', localData);
  
  // So sánh
  const nameElement = document.querySelector('[data-testid="user-name"]');
  console.log('Tên trên UI:', nameElement?.textContent);
  console.log('Tên từ DB:', apiData.user?.name);
};
checkProfile();
```

**3. Test cập nhật profile:**
- Thay đổi tên trong form
- Submit
- Kiểm tra Network có request `PUT /api/users/me`
- Reload và verify dữ liệu mới

### Test Exam Room

**1. Mở Exam Room:**
```
http://localhost:5173/exam-room
```

**2. Verify exam modes:**
```javascript
const checkExamModes = async () => {
  const token = localStorage.getItem('quizme_token');
  const response = await fetch('http://localhost:5000/api/exam-room/modes', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log('Exam modes từ DB:', data.modes);
  
  // Kiểm tra trên UI
  const modesElements = document.querySelectorAll('[data-testid="exam-mode"]');
  console.log('Số modes trên UI:', modesElements.length);
  console.log('Số modes từ DB:', data.modes?.length);
};
checkExamModes();
```

**3. Test start exam:**
- Click "Bắt đầu" một mode
- Kiểm tra Network có request `POST /api/exam-room/start`
- Verify questions được load từ DB

### Test Challenge 5 Min

**1. Mở Challenge:**
```
http://localhost:5173/challenge-5min
```

**2. Verify status:**
```javascript
const checkChallengeStatus = async () => {
  const token = localStorage.getItem('quizme_token');
  const response = await fetch('http://localhost:5000/api/challenge-5min/status', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log('Challenge status từ DB:', data);
  
  // Kiểm tra UI
  const statusElement = document.querySelector('[data-testid="challenge-status"]');
  console.log('Status trên UI:', statusElement?.textContent);
};
checkChallengeStatus();
```

### Test Leaderboard

**1. Mở Leaderboard:**
```
http://localhost:5173/leaderboard
```

**2. Verify leaderboard data:**
```javascript
const checkLeaderboard = async () => {
  const token = localStorage.getItem('quizme_token');
  const response = await fetch('http://localhost:5000/api/leaderboard?mode=weekly', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log('Leaderboard từ DB:', data);
  
  // Đếm số entries trên UI
  const entries = document.querySelectorAll('[data-testid="leaderboard-entry"]');
  console.log('Số entries trên UI:', entries.length);
  console.log('Số entries từ DB:', data.leaderboard?.length);
  
  // Verify current user rank
  console.log('My rank từ DB:', data.currentUser?.rank);
};
checkLeaderboard();
```

## 🔧 Công Cụ Debug

### 1. React DevTools

**Cài đặt:**
```bash
npm install -D @react-devtools/core
```

**Sử dụng:**
- Xem state của components
- Kiểm tra props
- Verify data flow

### 2. Redux DevTools (nếu dùng Redux)

- Xem actions
- Kiểm tra state changes
- Time travel debugging

### 3. Custom Debug Helper

**Tạo file `FE/src/utils/debug.ts`:**
```typescript
export const debugAPI = {
  // Log tất cả API calls
  logAPICall: (url: string, method: string, data?: any) => {
    console.log(`[API] ${method} ${url}`, data || '');
  },
  
  // Verify data từ API vs UI
  verifyData: (apiData: any, uiSelector: string, field: string) => {
    const uiElement = document.querySelector(uiSelector);
    const uiValue = uiElement?.textContent;
    const apiValue = apiData[field];
    
    console.log(`[VERIFY] ${field}:`, {
      fromAPI: apiValue,
      fromUI: uiValue,
      match: uiValue?.includes(String(apiValue))
    });
  },
  
  // Check nếu đang dùng mock data
  checkMockData: () => {
    const hasAPICalls = performance.getEntriesByType('resource')
      .some(entry => entry.name.includes('/api/'));
    
    console.log('[MOCK CHECK]', {
      hasAPICalls,
      isUsingRealData: hasAPICalls
    });
  }
};

// Sử dụng trong component
import { debugAPI } from '@/utils/debug';

useEffect(() => {
  debugAPI.checkMockData();
}, []);
```

## ✅ Checklist Verify Dữ Liệu Từ DB

### Cho mỗi trang:

- [ ] **Network Tab có request đến API**
  - Request URL đúng endpoint
  - Status code 200/201
  - Có Authorization header

- [ ] **Response có dữ liệu thật**
  - Có MongoDB ObjectId (24 ký tự hex)
  - Có timestamps (createdAt, updatedAt)
  - Dữ liệu khớp với DB

- [ ] **UI hiển thị dữ liệu từ API**
  - So sánh giá trị trên UI vs API response
  - Dữ liệu không hardcode

- [ ] **Dữ liệu cập nhật khi thay đổi**
  - Thực hiện action (submit, update)
  - Reload trang
  - Dữ liệu mới xuất hiện

- [ ] **Không có mock data**
  - Không có file mock data được import
  - Console không có log "mock"
  - Không có fallback data

## 🎯 Test Scenarios Cụ Thể

### Scenario 1: Test Dashboard với dữ liệu thật

**Bước 1: Tạo dữ liệu test trong DB**
```javascript
// Chạy trong MongoDB shell hoặc script
db.users.insertOne({
  email: "test@example.com",
  fullName: "Test User",
  xp: 1000,
  level: 5,
  streakDays: 7
});

db.dailymissions.insertOne({
  user: ObjectId("..."),
  title: "Test Mission",
  progress: 0,
  total: 10,
  date: new Date()
});
```

**Bước 2: Login và mở Dashboard**
- Login với user vừa tạo
- Mở `/dashboard`

**Bước 3: Verify**
- Network tab: `GET /api/dashboard` → 200
- Response có `stats.totalXP: 1000`
- UI hiển thị "1000 XP"
- UI hiển thị "Level 5"
- UI hiển thị "7 ngày streak"

### Scenario 2: Test Exam Room với questions từ DB

**Bước 1: Tạo questions trong DB**
```javascript
db.questions.insertMany([
  {
    text: "Câu hỏi test 1?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    subject: ObjectId("..."),
    topic: ObjectId("...")
  }
]);
```

**Bước 2: Start exam**
- Mở `/exam-room`
- Click "Bắt đầu Sprint Mode"

**Bước 3: Verify**
- Network: `POST /api/exam-room/start` → 200
- Response có `questions` array
- UI hiển thị questions từ response
- Questions có text, options từ DB

### Scenario 3: Test Challenge 5 Min completion

**Bước 1: Complete challenge**
- Mở `/challenge-5min`
- Làm challenge
- Submit

**Bước 2: Verify trong DB**
```javascript
// Check trong MongoDB
db.challengeattempts.findOne({
  user: ObjectId("..."),
  completed: true
});
```

**Bước 3: Reload và verify**
- Reload trang challenge
- Network: `GET /api/challenge-5min/status`
- Response: `completed: true`
- UI hiển thị "Đã hoàn thành"

## 🐛 Troubleshooting

### Vấn đề: UI hiển thị nhưng không có API call

**Nguyên nhân:**
- Component đang dùng mock data
- API call bị fail nhưng có fallback

**Giải pháp:**
1. Check Network tab
2. Check Console errors
3. Tìm trong code: `mock`, `fallback`, `default`
4. Remove mock data và fix API call

### Vấn đề: API call thành công nhưng UI không update

**Nguyên nhân:**
- State không được update
- Component không re-render

**Giải pháp:**
1. Check React DevTools - state có update không
2. Check useEffect dependencies
3. Verify setState được gọi

### Vấn đề: Dữ liệu khác nhau giữa API và UI

**Nguyên nhân:**
- Caching
- State cũ chưa được clear

**Giải pháp:**
1. Clear cache và reload
2. Check localStorage có data cũ không
3. Verify API response mới nhất

## 📊 Monitoring Tools

### 1. Thêm API Logger

```typescript
// FE/src/utils/apiLogger.ts
export const apiLogger = {
  log: (url: string, method: string, response: any) => {
    console.group(`[API] ${method} ${url}`);
    console.log('Response:', response);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
};

// Sử dụng trong api.ts interceptor
api.interceptors.response.use(
  (response) => {
    apiLogger.log(response.config.url, response.config.method, response.data);
    return response;
  }
);
```

### 2. Thêm Data Verification

```typescript
// FE/src/utils/verifyData.ts
export const verifyDataFromDB = (data: any) => {
  // Check có ObjectId không (MongoDB)
  const hasObjectId = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return /^[0-9a-fA-F]{24}$/.test(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(val => hasObjectId(val));
    }
    return false;
  };
  
  const isFromDB = hasObjectId(data);
  console.log('[VERIFY] Data from DB:', isFromDB);
  return isFromDB;
};
```

## 🎓 Best Practices

1. **Luôn check Network tab trước**
2. **So sánh API response vs UI**
3. **Test với dữ liệu thật trong DB**
4. **Verify sau mỗi action (create, update, delete)**
5. **Clear cache khi test**
6. **Dùng React DevTools để debug state**

## 📝 Test Report Template

```markdown
## Test Report - [Page Name]

### Date: [Date]
### Tester: [Name]

### Test Results:
- [ ] Network có API call: ✅/❌
- [ ] API response có dữ liệu: ✅/❌
- [ ] UI hiển thị đúng: ✅/❌
- [ ] Dữ liệu từ DB (không phải mock): ✅/❌
- [ ] Dữ liệu cập nhật khi thay đổi: ✅/❌

### Issues Found:
- [Issue description]

### Screenshots:
- [Attach screenshots]
```

