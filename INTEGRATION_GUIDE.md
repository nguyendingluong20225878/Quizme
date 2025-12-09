# 🔗 Hướng dẫn Tích hợp Frontend với Backend

## 📋 Tổng quan

Frontend đã được tích hợp sẵn với Backend API thông qua các service files trong `FE/src/services/`.

## 🎯 Các Service đã có sẵn

### ✅ Đã tích hợp hoàn chỉnh

1. **authService.ts** - Authentication (Login, Register, Get Me)
2. **userService.ts** - User stats, XP, Level, Streak
3. **missionService.ts** - Daily Missions
4. **achievementService.ts** - Achievements
5. **leaderboardService.ts** - Leaderboards
6. **examService.ts** - Exams và Exam Attempts
7. **api.ts** - Base API configuration với interceptors

## 🚀 Cách sử dụng Services

### 1. Import Service

```typescript
import { userService } from '@/services/userService';
import { missionService } from '@/services/missionService';
import { achievementService } from '@/services/achievementService';
```

### 2. Sử dụng trong Component

```typescript
import { useEffect, useState } from 'react';
import { userService } from '@/services/userService';

function MyComponent() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <p>Level: {stats?.level}</p>
      <p>XP: {stats?.currentXP}</p>
    </div>
  );
}
```

## 📝 Ví dụ sử dụng các Service

### Authentication

```typescript
import { authService } from '@/services/authService';

// Login
const response = await authService.login({
  email: 'test@example.com',
  password: '123456'
});

// Register
const response = await authService.register({
  fullName: 'Nguyễn Văn A',
  email: 'test@example.com',
  password: '123456',
  studentId: '01000071',
  grade: '12',
  className: '12A1'
});

// Get current user
const user = await authService.getMe();
```

### User Stats & XP

```typescript
import { userService } from '@/services/userService';

// Get stats
const stats = await userService.getStats();
// { level: 2, currentXP: 150, xpToNextLevel: 250, totalXP: 150 }

// Get streak
const streak = await userService.getStreak();
// { currentStreak: 3, longestStreak: 3, canCheckInToday: false }

// Check-in streak
const updatedStreak = await userService.checkInStreak();

// Get XP history
const history = await userService.getXPHistory(20);
```

### Daily Missions

```typescript
import { missionService } from '@/services/missionService';

// Get daily missions
const missions = await missionService.getDailyMissions();

// Update progress
await missionService.updateProgress(missionId, 5);

// Complete mission
const result = await missionService.completeMission(missionId);
// { mission: {...}, xpEarned: 50 }
```

### Achievements

```typescript
import { achievementService } from '@/services/achievementService';

// Get all achievements
const achievements = await achievementService.getAllAchievements();

// Get progress
const progress = await achievementService.getMyProgress();

// Unlock achievement (usually auto, but can manual)
await achievementService.unlockAchievement(achievementId);
```

### Leaderboard

```typescript
import { leaderboardService } from '@/services/leaderboardService';

// Get weekly leaderboard
const weekly = await leaderboardService.getWeeklyLeaderboard(50);

// Get monthly leaderboard
const monthly = await leaderboardService.getMonthlyLeaderboard(50);

// Get all-time leaderboard
const allTime = await leaderboardService.getAllTimeLeaderboard(50);

// Get friends leaderboard
const friends = await leaderboardService.getFriendsLeaderboard();
```

## 🔧 Cấu hình API Base URL

### Development

Tạo file `FE/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Production

```env
VITE_API_URL=https://api.quizme.com/api
```

Nếu không set, sẽ dùng default: `http://localhost:5000/api`

## 🔐 Authentication Flow

### 1. Login/Register

```typescript
import { authService } from '@/services/authService';

// Login
const response = await authService.login({ email, password });
// Token tự động được lưu vào localStorage

// Register
const response = await authService.register({ fullName, email, password });
// Token tự động được lưu vào localStorage
```

### 2. Auto Token Injection

Token tự động được thêm vào mọi request thông qua axios interceptor trong `api.ts`:

```typescript
// Tự động lấy token từ localStorage
const token = localStorage.getItem('quizme_token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

### 3. Auto Logout on 401

Khi token hết hạn hoặc invalid, tự động:
- Xóa token khỏi localStorage
- Redirect về login (nếu không đang ở trang auth)

## 📊 Response Format

Tất cả services đã được cấu hình để xử lý response format từ backend:

```typescript
// Backend response
{
  "success": true,
  "data": { ... },
  "message": "..."
}

// Service sẽ tự động extract data
const result = await userService.getStats();
// result = { level: 2, currentXP: 150, ... }
```

## 🎨 Sử dụng với React Context

### AuthContext

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔄 Auto Updates

### Sau khi nộp bài thi

Khi user submit exam, backend tự động:
1. Tính và thêm XP
2. Cập nhật streak
3. Cập nhật mission progress
4. Kiểm tra và unlock achievements

Frontend chỉ cần refresh data:

```typescript
// Sau khi submit exam
await examService.submitExam(attemptId);

// Refresh stats
const newStats = await userService.getStats();
setStats(newStats);

// Refresh missions
const missions = await missionService.getDailyMissions();
setMissions(missions);
```

## 🐛 Error Handling

Tất cả services sử dụng try-catch:

```typescript
try {
  const data = await userService.getStats();
  setStats(data);
} catch (error) {
  // Error message đã được format sẵn từ api.ts
  console.error(error.message);
  // Hiển thị toast notification
  toast.error(error.message);
}
```

## 📱 Example: Complete Component

```typescript
import { useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import { missionService } from '@/services/missionService';
import { toast } from 'sonner';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch parallel
        const [statsData, missionsData] = await Promise.all([
          userService.getStats(),
          missionService.getDailyMissions(),
        ]);

        setStats(statsData);
        setMissions(missionsData);
      } catch (error) {
        toast.error('Không thể tải dữ liệu');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompleteMission = async (missionId: string) => {
    try {
      const result = await missionService.completeMission(missionId);
      toast.success(`Nhận được ${result.xpEarned} XP!`);
      
      // Refresh data
      const [statsData, missionsData] = await Promise.all([
        userService.getStats(),
        missionService.getDailyMissions(),
      ]);
      setStats(statsData);
      setMissions(missionsData);
    } catch (error) {
      toast.error('Không thể hoàn thành mission');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Level {stats?.level}</h1>
      <p>XP: {stats?.currentXP} / {stats?.xpToNextLevel + stats?.currentXP}</p>
      
      <h2>Daily Missions</h2>
      {missions.map(mission => (
        <div key={mission.id}>
          <h3>{mission.title}</h3>
          <p>{mission.progress} / {mission.target}</p>
          {mission.completed ? (
            <button onClick={() => handleCompleteMission(mission.id)}>
              Claim Reward
            </button>
          ) : (
            <progress value={mission.progress} max={mission.target} />
          )}
        </div>
      ))}
    </div>
  );
}
```

## ✅ Checklist Integration

- [x] API Base URL configured
- [x] Authentication flow
- [x] Token management
- [x] Error handling
- [x] Response format mapping
- [x] Services updated for BE format
- [ ] Test all endpoints
- [ ] Update components to use services
- [ ] Add loading states
- [ ] Add error states
- [ ] Add toast notifications

## 🚀 Next Steps

1. **Test API Connection**
   - Chạy backend: `cd apps/api && npm run dev`
   - Chạy frontend: `cd FE && npm run dev`
   - Test login/register

2. **Update Components**
   - Thay thế mock data bằng API calls
   - Thêm loading/error states
   - Thêm toast notifications

3. **Test Features**
   - Daily Missions
   - XP & Level system
   - Streak
   - Achievements
   - Leaderboard

## 📚 Tài liệu tham khảo

- [Setup Guide](./SETUP_GUIDE.md)
- [Postman Testing Guide](./POSTMAN_TESTING_GUIDE.md)
- [Backend API Documentation](./apps/api/README.md)

