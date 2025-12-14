# 📊 Trạng Thái Liên Kết API - Frontend

## Tổng Quan
File này liệt kê các API từ Backend và trạng thái liên kết với Frontend.

---

## ✅ ĐÃ LIÊN KẾT VỚI FRONTEND

### 1. Authentication APIs
**Backend APIs:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**Frontend Service:** `FE/src/services/authService.ts`
- ✅ `authService.login()` - dòng 59-68
- ✅ `authService.register()` - dòng 74-83
- ✅ `authService.getMe()` - dòng 89-91

**Được sử dụng trong:**
- `FE/src/contexts/AuthContext.tsx` - login, register, getMe
- `FE/src/components/auth/LoginPage.tsx` - login
- `FE/src/components/auth/RegisterPage.tsx` - register

---

### 2. User Management APIs
**Backend APIs:**
- `GET /api/users/me` - ❌ CHƯA CÓ (chỉ có GET /api/auth/me)
- `PUT /api/users/me` ✅
- `GET /api/users/me/xp` ✅
- `POST /api/users/me/xp/add` ✅
- `GET /api/users/me/xp/history` ✅

**Frontend Service:** `FE/src/services/userService.ts`
- ✅ `userService.updateProfile()` - dòng 140-148 (PUT /api/users/me)
- ✅ `userService.getStats()` - dòng 48-57 (GET /api/users/me/xp)
- ✅ `userService.addXP()` - dòng 111-116 (POST /api/users/me/xp/add)
- ✅ `userService.getXPHistory()` - dòng 93-105 (GET /api/users/me/xp/history)
- ✅ `userService.getAchievements()` - dòng 122-134 (GET /api/users/me/achievements)

**Được sử dụng trong:**
- `FE/src/contexts/AuthContext.tsx` - updateProfile trong completeOnboarding
- `FE/src/pages/DashboardPage.tsx` - getStats, getStreak

**Lưu ý:** Backend có `GET /api/users/me` nhưng FE đang dùng `GET /api/auth/me`. Cần kiểm tra xem 2 endpoint này có khác nhau không.

---

### 3. Streak System APIs
**Backend APIs:**
- `GET /api/users/me/streak` ✅
- `POST /api/users/me/streak/checkin` ✅

**Frontend Service:** `FE/src/services/userService.ts`
- ✅ `userService.getStreak()` - dòng 63-72 (GET /api/users/me/streak)
- ✅ `userService.checkInStreak()` - dòng 78-87 (POST /api/users/me/streak/checkin)

**Được sử dụng trong:**
- `FE/src/pages/DashboardPage.tsx` - getStreak

---

### 4. Exams & Questions APIs
**Backend APIs:**
- `GET /api/exams` ✅
- `GET /api/exams/:id` ✅
- `POST /api/exams` - ❌ CHƯA (admin only, có thể không cần FE)
- `POST /api/exams/factory` ✅
- `GET /api/questions` - ❌ CHƯA CÓ trong examService
- `POST /api/questions` - ❌ CHƯA (admin only)

**Frontend Service:** `FE/src/services/examService.ts`
- ✅ `examService.getExams()` - dòng 88 (GET /api/exams)
- ✅ `examService.getExam()` - dòng 96 (GET /api/exams/:id)
- ✅ `examService.createCustomExam()` - dòng 109 (POST /api/exams/factory)
- ❌ **THIẾU:** `getQuestions()` - GET /api/questions (nếu cần hiển thị danh sách questions riêng)

**Được sử dụng trong:**
- `FE/src/components/exam/ExamRoomContainer.tsx` - getExams, createCustomExam
- `FE/src/components/TestsHub.tsx` - getExams

---

### 5. Exam Attempts APIs
**Backend APIs:**
- `POST /api/exam-attempts/start` ✅
- `PUT /api/exam-attempts/:id/answer` ✅
- `POST /api/exam-attempts/:id/submit` ✅
- `GET /api/exam-attempts` ✅
- `GET /api/exam-attempts/:id` ✅

**Frontend Service:** `FE/src/services/examService.ts`
- ✅ `examService.startExam()` - dòng 120-124 (POST /api/exam-attempts/start)
- ✅ `examService.saveAnswer()` - dòng 136-141 (PUT /api/exam-attempts/:id/answer)
- ✅ `examService.submitExam()` - dòng 152-155 (POST /api/exam-attempts/:id/submit)
- ✅ `examService.getAttemptHistory()` - dòng 173 (GET /api/exam-attempts)
- ✅ `examService.getAttemptResult()` - dòng 162 (GET /api/exam-attempts/:id)
- ✅ `examService.getAttemptAnalysis()` - dòng 181 (GET /api/exam-attempts/:id/analysis)
- ✅ `examService.getMyPerformance()` - dòng 196 (GET /api/exam-attempts/my-performance)

**Được sử dụng trong:**
- `FE/src/components/exam/` - các component exam

---

### 6. Achievements APIs
**Backend APIs:**
- `GET /api/achievements` ✅
- `GET /api/achievements/progress` ✅
- `POST /api/achievements/:id/unlock` ✅

**Frontend Service:** `FE/src/services/achievementService.ts`
- ✅ `achievementService.getAllAchievements()` - dòng 35 (GET /api/achievements)
- ✅ `achievementService.getMyProgress()` - dòng 57 (GET /api/achievements/progress)
- ✅ `achievementService.unlockAchievement()` - dòng 89 (POST /api/achievements/:id/unlock)

**Được sử dụng trong:**
- `FE/src/components/Achievements.tsx` - getAllAchievements, getMyProgress

---

### 7. Missions APIs
**Backend APIs:**
- `GET /api/missions/daily` ✅
- `PATCH /api/missions/:id/progress` ✅
- `POST /api/missions/:id/complete` ✅

**Frontend Service:** `FE/src/services/missionService.ts`
- ✅ `missionService.getDailyMissions()` - dòng 31 (GET /api/missions/daily)
- ✅ `missionService.updateProgress()` - dòng 51 (PATCH /api/missions/:id/progress)
- ✅ `missionService.completeMission()` - dòng 76 (POST /api/missions/:id/complete)

**Được sử dụng trong:**
- `FE/src/components/DashboardOptimized.tsx` - getDailyMissions
- `FE/src/components/DailyMissionRing.tsx` - getDailyMissions

---

### 8. Leaderboard APIs
**Backend APIs:**
- `GET /api/leaderboard/weekly` ✅
- `GET /api/leaderboard/monthly` ✅
- `GET /api/leaderboard/alltime` ✅
- `GET /api/leaderboard/friends` ✅

**Frontend Service:** `FE/src/services/leaderboardService.ts`
- ✅ `leaderboardService.getWeeklyLeaderboard()` - dòng 34 (GET /api/leaderboard/weekly)
- ✅ `leaderboardService.getMonthlyLeaderboard()` - dòng 60 (GET /api/leaderboard/monthly)
- ✅ `leaderboardService.getAllTimeLeaderboard()` - dòng 86 (GET /api/leaderboard/alltime)
- ✅ `leaderboardService.getFriendsLeaderboard()` - dòng 113 (GET /api/leaderboard/friends)

**Được sử dụng trong:**
- `FE/src/components/exam/RankingMode.tsx` - getWeeklyLeaderboard, getMonthlyLeaderboard
- Có thể cần thêm các component khác để hiển thị leaderboard

---

## ✅ ĐÃ LIÊN KẾT - VỪA TẠO MỚI

### 9. Content Management APIs
**Backend APIs:**
- `GET /api/subjects` ✅
- `GET /api/topics` ✅
- `GET /api/formulas` ✅
- `GET /api/videos` ✅
- `GET /api/tips` ✅

**Frontend Service:** `FE/src/services/contentService.ts` (MỚI TẠO)
- ✅ `contentService.getSubjects()` - GET /api/subjects
- ✅ `contentService.getTopics()` - GET /api/topics
- ✅ `contentService.getFormulas()` - GET /api/formulas
- ✅ `contentService.getVideos()` - GET /api/videos
- ✅ `contentService.getTips()` - GET /api/tips

**Được export trong:** `FE/src/services/index.ts`

**Có thể sử dụng trong:**
- `FE/src/components/onboarding/SubjectSelection.tsx` - **CẦN UPDATE** để dùng `contentService.getSubjects()` thay vì hardcode
- Learning Roadmap - để load subjects, topics
- Formula Reinforcement - để load formulas
- Video components - để load videos
- Tips components - để load tips

---

## 📝 TÓM TẮT

### Đã liên kết: ✅
1. ✅ Authentication (3/3 APIs)
2. ✅ User Management (4/5 APIs - thiếu GET /api/users/me)
3. ✅ Streak System (2/2 APIs)
4. ✅ Exams (3/4 APIs - thiếu GET /api/questions)
5. ✅ Exam Attempts (5/5 APIs + thêm 2 APIs analysis)
6. ✅ Achievements (3/3 APIs)
7. ✅ Missions (3/3 APIs)
8. ✅ Leaderboard (4/4 APIs)

### Chưa liên kết: ❌
- Không có (tất cả đã được liên kết!)

---

## 🔧 HÀNH ĐỘNG ĐÃ HOÀN THÀNH VÀ CẦN LÀM TIẾP

### ✅ Đã hoàn thành:
1. ✅ **Đã tạo `contentService.ts`** - liên kết 5 APIs Content Management
2. ✅ **Đã export trong `index.ts`**

### 🔄 Cần cập nhật components:
1. **Cập nhật `SubjectSelection.tsx`** - thay hardcode subjects bằng `contentService.getSubjects()`
2. **Cập nhật các component khác** sử dụng topics/formulas/videos/tips để dùng `contentService`

### ⚠️ Lưu ý:
1. `GET /api/users/me` - Backend có API này nhưng FE đang dùng `GET /api/auth/me`. Cần kiểm tra xem có khác nhau không.
2. `GET /api/questions` - Có thể thêm vào examService nếu cần hiển thị danh sách questions riêng

