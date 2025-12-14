# Routes và APIs Mapping - QuizMe Frontend

## 📍 Routes và API Endpoints Tương Ứng

### 🔐 Authentication Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/login` | `LoginPageRoute` | `POST /api/auth/login` |
| `/register` | `RegisterPageRoute` | `POST /api/auth/register` |
| `/forgot-password` | `ForgotPasswordPageRoute` | `POST /api/auth/forgot-password`<br>`POST /api/auth/reset-password` |

### 🎯 Onboarding Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/goal-selection` | `GoalSelectionPage` | `GET /api/onboarding/goals`<br>`POST /api/onboarding/complete` |
| `/subject-selection` | `SubjectSelectionPage` | `GET /api/onboarding/subjects`<br>`POST /api/onboarding/complete` |
| `/placement-test` | `PlacementTestPage` | `GET /api/onboarding/placement-test`<br>`POST /api/onboarding/placement-test/submit` |

### 🏠 Main App Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/dashboard` | `DashboardPage` | `GET /api/dashboard`<br>`GET /api/dashboard/daily-missions`<br>`GET /api/dashboard/stats`<br>`POST /api/dashboard/daily-missions/update` |

### 📝 Exam Room Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/exam-room` | `ExamRoomPage` | `GET /api/exam-room/modes` |
| `/exam-room/sprint` | `ExamRoomPage` | `POST /api/exam-room/start` (mode: sprint)<br>`POST /api/exam-room/submit`<br>`GET /api/exam-room/results/:resultId`<br>`GET /api/exam-room/history` |
| `/exam-room/marathon` | `ExamRoomPage` | `POST /api/exam-room/start` (mode: marathon)<br>`POST /api/exam-room/submit`<br>`GET /api/exam-room/results/:resultId`<br>`GET /api/exam-room/history` |
| `/exam-room/ranking` | `ExamRoomPage` | `POST /api/exam-room/start` (mode: weekly)<br>`POST /api/exam-room/submit`<br>`GET /api/exam-room/results/:resultId`<br>`GET /api/exam-room/history` |

### ⚡ Challenge 5 Min Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/challenge-5min` | `Challenge5MinPage` | `GET /api/challenge-5min/status`<br>`POST /api/challenge-5min/start`<br>`POST /api/challenge-5min/submit-answer`<br>`POST /api/challenge-5min/complete` |

### ⏰ Golden Time Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/golden-time` | `GoldenTimePage` | `GET /api/golden-time/cards`<br>`POST /api/golden-time/start-session`<br>`POST /api/golden-time/review`<br>`POST /api/golden-time/complete-session` |

### 🗺️ Learning Roadmap Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/roadmap` | `RoadmapPage` | `GET /api/roadmap`<br>`GET /api/roadmap/stages/:stageId`<br>`POST /api/roadmap/stages/:stageId/progress`<br>`POST /api/roadmap/stages/:stageId/boss/complete` |

### 📊 Analytics Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/analytics` | `AnalyticsPage` | `GET /api/analytics/overview`<br>`GET /api/analytics/subjects/:subject`<br>`GET /api/analytics/progress?period=week\|month\|year` |

### 👤 Profile Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/profile` | `ProfilePageRoute` | `GET /api/profile`<br>`PUT /api/users/me`<br>`POST /api/profile/avatar` |

### 🏅 Leaderboard Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/leaderboard` | `LeaderboardPage` | `GET /api/leaderboard?mode=weekly\|monthly\|alltime&subject=...&limit=...`<br>`GET /api/leaderboard/my-rank?mode=weekly\|monthly\|alltime` |

### 📚 Test Library Routes

| Route | Component | API Endpoints |
|-------|-----------|---------------|
| `/test-library` | `TestLibraryPage` | `GET /api/tests/library?subject=...&difficulty=...&type=...&search=...&limit=...&offset=...`<br>`POST /api/tests/custom/create`<br>`GET /api/tests/:testId` |

## 🔄 Navigation Flow

### Authentication Flow
```
/login → (success) → /goal-selection (if not onboarded) or /dashboard (if onboarded)
/register → (success) → /goal-selection
/forgot-password → (reset) → /login
```

### Onboarding Flow
```
/goal-selection → /subject-selection → /placement-test → /dashboard
```

### Main App Flow
```
/dashboard → (tabs) → /exam-room, /challenge-5min, /golden-time, /roadmap, /analytics, /profile, /leaderboard, /test-library
```

## 🛡️ Protected Routes

Tất cả routes sau `/dashboard` đều được bảo vệ bởi `ProtectedRoute`:
- Yêu cầu authentication (redirect to `/login` nếu chưa login)
- Yêu cầu onboarding hoàn thành (redirect to `/goal-selection` nếu chưa onboard)

## 📝 Notes

1. **Dashboard Tabs**: DashboardPage sử dụng tabs để hiển thị các sections khác nhau, nhưng mỗi section cũng có route riêng để có thể truy cập trực tiếp.

2. **Exam Room Modes**: Các mode (sprint, marathon, ranking) được xử lý trong cùng một component `ExamRoomPage` dựa trên URL params.

3. **API Base URL**: Tất cả API calls sử dụng base URL từ `FE/src/services/api.ts` (default: `http://localhost:5000/api`)

4. **Authentication**: Tất cả API calls (trừ auth endpoints) đều cần JWT token trong header: `Authorization: Bearer {token}`

## 🧪 Testing Routes

Để test routes, truy cập trực tiếp:
- `http://localhost:5173/login`
- `http://localhost:5173/dashboard`
- `http://localhost:5173/exam-room`
- `http://localhost:5173/challenge-5min`
- `http://localhost:5173/golden-time`
- `http://localhost:5173/roadmap`
- `http://localhost:5173/analytics`
- `http://localhost:5173/profile`
- `http://localhost:5173/leaderboard`
- `http://localhost:5173/test-library`

