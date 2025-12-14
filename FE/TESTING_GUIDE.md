# Hướng Dẫn Test Frontend Services

## 1. Setup và Khởi động

### Yêu cầu
- Node.js (v16+)
- Backend API đang chạy tại `http://localhost:5000`

### Khởi động Frontend
```bash
cd FE
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173` (hoặc port khác nếu 5173 bị chiếm)

## 2. Test Authentication Services

### 2.1. Đăng ký
```typescript
import { authService } from './services';

const registerData = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: '123456'
};

try {
  const response = await authService.register(registerData);
  console.log('Register success:', response);
} catch (error) {
  console.error('Register error:', error);
}
```

### 2.2. Đăng nhập
```typescript
const loginData = {
  email: 'test@example.com',
  password: '123456'
};

try {
  const response = await authService.login(loginData);
  console.log('Login success:', response);
  // Token sẽ được lưu tự động vào localStorage
} catch (error) {
  console.error('Login error:', error);
}
```

### 2.3. Lấy thông tin user
```typescript
try {
  const user = await authService.getMe();
  console.log('Current user:', user);
} catch (error) {
  console.error('Get me error:', error);
}
```

### 2.4. Quên mật khẩu
```typescript
try {
  await authService.forgotPassword('test@example.com');
  console.log('Forgot password email sent');
} catch (error) {
  console.error('Forgot password error:', error);
}
```

### 2.5. Đặt lại mật khẩu
```typescript
try {
  await authService.resetPassword(
    'test@example.com',
    'RESET_TOKEN_FROM_EMAIL',
    'newpassword123'
  );
  console.log('Password reset success');
} catch (error) {
  console.error('Reset password error:', error);
}
```

### 2.6. Đăng xuất
```typescript
await authService.logout();
// Token sẽ được xóa khỏi localStorage
```

## 3. Test Onboarding Services

### 3.1. Lấy danh sách goals
```typescript
import { onboardingService } from './services';

try {
  const { goals } = await onboardingService.getGoals();
  console.log('Available goals:', goals);
} catch (error) {
  console.error('Get goals error:', error);
}
```

### 3.2. Lấy danh sách subjects
```typescript
try {
  const { subjects } = await onboardingService.getSubjects();
  console.log('Available subjects:', subjects);
} catch (error) {
  console.error('Get subjects error:', error);
}
```

### 3.3. Lấy placement test
```typescript
try {
  const { questions } = await onboardingService.getPlacementTest();
  console.log('Placement test questions:', questions);
} catch (error) {
  console.error('Get placement test error:', error);
}
```

### 3.4. Submit placement test
```typescript
const answers = [
  { questionId: 'q1', answer: 'A' },
  { questionId: 'q2', answer: 'B' }
];

try {
  const result = await onboardingService.submitPlacementTest({ answers });
  console.log('Placement test result:', result);
  console.log('Level:', result.level);
} catch (error) {
  console.error('Submit placement test error:', error);
}
```

### 3.5. Hoàn thành onboarding
```typescript
const onboardingData = {
  goals: ['Nâng cao điểm số', 'Ôn tập cho kỳ thi'],
  subjects: ['Toán', 'Lý'],
  placementLevel: 5
};

try {
  const result = await onboardingService.completeOnboarding(onboardingData);
  console.log('Onboarding completed:', result);
} catch (error) {
  console.error('Complete onboarding error:', error);
}
```

## 4. Test Dashboard Services

### 4.1. Lấy dashboard tổng hợp
```typescript
import { dashboardService } from './services';

try {
  const dashboard = await dashboardService.getDashboard();
  console.log('Dashboard data:', dashboard);
  console.log('Challenge completed:', dashboard.challenge5MinCompleted);
  console.log('Daily missions:', dashboard.dailyMissions);
  console.log('Stats:', dashboard.stats);
} catch (error) {
  console.error('Get dashboard error:', error);
}
```

### 4.2. Lấy daily missions
```typescript
try {
  const { missions } = await dashboardService.getDailyMissions();
  console.log('Daily missions:', missions);
} catch (error) {
  console.error('Get daily missions error:', error);
}
```

### 4.3. Cập nhật mission progress
```typescript
try {
  const mission = await dashboardService.updateMissionProgress('MISSION_ID', 5);
  console.log('Mission updated:', mission);
} catch (error) {
  console.error('Update mission error:', error);
}
```

### 4.4. Lấy stats
```typescript
try {
  const stats = await dashboardService.getStats();
  console.log('Stats:', stats);
} catch (error) {
  console.error('Get stats error:', error);
}
```

## 5. Test Streak Services

### 5.1. Lấy thông tin streak
```typescript
import { streakService } from './services';

try {
  const streak = await streakService.getStreak();
  console.log('Current streak:', streak.currentStreak);
  console.log('Is at risk:', streak.isAtRisk);
  console.log('Streak history:', streak.streakHistory);
} catch (error) {
  console.error('Get streak error:', error);
}
```

### 5.2. Cập nhật streak
```typescript
try {
  const result = await streakService.updateStreak('USER_ID', 'challenge');
  console.log('New streak:', result.newStreak);
  if (result.bonusXP) {
    console.log('Bonus XP:', result.bonusXP);
  }
  if (result.milestone) {
    console.log('Milestone:', result.milestone);
  }
} catch (error) {
  console.error('Update streak error:', error);
}
```

## 6. Test Exam Room Services

### 6.1. Lấy danh sách modes
```typescript
import { examRoomService } from './services';

try {
  const { modes } = await examRoomService.getExamModes();
  console.log('Exam modes:', modes);
} catch (error) {
  console.error('Get exam modes error:', error);
}
```

### 6.2. Bắt đầu exam
```typescript
try {
  const exam = await examRoomService.startExam('sprint', ['Toán']);
  console.log('Exam started:', exam);
  console.log('Questions:', exam.questions);
  console.log('Time limit:', exam.timeLimit);
} catch (error) {
  console.error('Start exam error:', error);
}
```

### 6.3. Submit exam
```typescript
const answers = [
  { questionId: 'q1', answer: 'A', timeSpent: 30 },
  { questionId: 'q2', answer: 'B', timeSpent: 45 }
];

try {
  const result = await examRoomService.submitExam('EXAM_ID', answers, 'sprint');
  console.log('Exam result:', result);
  console.log('Score:', result.score);
  console.log('XP earned:', result.xpEarned);
} catch (error) {
  console.error('Submit exam error:', error);
}
```

### 6.4. Lấy kết quả
```typescript
try {
  const result = await examRoomService.getExamResult('RESULT_ID');
  console.log('Exam result details:', result);
} catch (error) {
  console.error('Get exam result error:', error);
}
```

### 6.5. Lấy lịch sử
```typescript
try {
  const history = await examRoomService.getExamHistory('sprint', 10, 0);
  console.log('Exam history:', history);
} catch (error) {
  console.error('Get exam history error:', error);
}
```

## 7. Test Challenge 5 Min Services

### 7.1. Kiểm tra status
```typescript
import { challenge5MinService } from './services';

try {
  const status = await challenge5MinService.getChallengeStatus();
  console.log('Challenge status:', status);
  console.log('Completed:', status.completed);
} catch (error) {
  console.error('Get challenge status error:', error);
}
```

### 7.2. Bắt đầu challenge
```typescript
try {
  const challenge = await challenge5MinService.startChallenge();
  console.log('Challenge started:', challenge);
  console.log('Questions:', challenge.questions);
} catch (error) {
  console.error('Start challenge error:', error);
}
```

### 7.3. Submit answer
```typescript
try {
  const feedback = await challenge5MinService.submitAnswer(
    'CHALLENGE_ID',
    'QUESTION_ID',
    'A',
    30
  );
  console.log('Answer feedback:', feedback);
  console.log('Correct:', feedback.correct);
  console.log('Explanation:', feedback.explanation);
} catch (error) {
  console.error('Submit answer error:', error);
}
```

### 7.4. Hoàn thành challenge
```typescript
try {
  const result = await challenge5MinService.completeChallenge('CHALLENGE_ID', 80);
  console.log('Challenge completed:', result);
  console.log('XP earned:', result.xpEarned);
} catch (error) {
  console.error('Complete challenge error:', error);
}
```

## 8. Test Golden Time Services

### 8.1. Lấy cards
```typescript
import { goldenTimeService } from './services';

try {
  const { cards } = await goldenTimeService.getCards();
  console.log('Cards to review:', cards);
} catch (error) {
  console.error('Get cards error:', error);
}
```

### 8.2. Bắt đầu session
```typescript
try {
  const session = await goldenTimeService.startSession(['CARD_ID_1', 'CARD_ID_2']);
  console.log('Session started:', session);
  console.log('Flashcards:', session.flashcards);
} catch (error) {
  console.error('Start session error:', error);
}
```

### 8.3. Review card
```typescript
try {
  const result = await goldenTimeService.reviewCard(
    'SESSION_ID',
    'CARD_ID',
    true,
    4
  );
  console.log('Review result:', result);
  console.log('Next review date:', result.nextReviewDate);
} catch (error) {
  console.error('Review card error:', error);
}
```

### 8.4. Hoàn thành session
```typescript
try {
  const result = await goldenTimeService.completeSession('SESSION_ID');
  console.log('Session completed:', result);
  console.log('Total reviewed:', result.totalReviewed);
} catch (error) {
  console.error('Complete session error:', error);
}
```

## 9. Test Analytics Services

### 9.1. Lấy overview
```typescript
import { analyticsService } from './services';

try {
  const overview = await analyticsService.getOverview();
  console.log('Analytics overview:', overview);
  console.log('Spider chart:', overview.spiderChart);
  console.log('Weak topics:', overview.weakTopics);
} catch (error) {
  console.error('Get overview error:', error);
}
```

### 9.2. Phân tích theo subject
```typescript
try {
  const analysis = await analyticsService.getSubjectAnalysis('Toán');
  console.log('Subject analysis:', analysis);
  console.log('Overall score:', analysis.overallScore);
  console.log('Recommendations:', analysis.recommendations);
} catch (error) {
  console.error('Get subject analysis error:', error);
}
```

### 9.3. Phân tích progress
```typescript
try {
  const progress = await analyticsService.getProgress('week');
  console.log('Progress data:', progress);
  console.log('Summary:', progress.summary);
} catch (error) {
  console.error('Get progress error:', error);
}
```

## 10. Test Profile Services

### 10.1. Lấy profile
```typescript
import { profileService } from './services';

try {
  const profile = await profileService.getProfile();
  console.log('Profile:', profile);
  console.log('User:', profile.user);
  console.log('Badges:', profile.badges);
  console.log('Achievements:', profile.achievements);
} catch (error) {
  console.error('Get profile error:', error);
}
```

### 10.2. Cập nhật profile
```typescript
try {
  const updated = await profileService.updateProfile({
    name: 'New Name',
    goals: ['Goal 1', 'Goal 2']
  });
  console.log('Profile updated:', updated);
} catch (error) {
  console.error('Update profile error:', error);
}
```

### 10.3. Upload avatar
```typescript
// Trong React component
const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const result = await profileService.uploadAvatar(file);
    console.log('Avatar uploaded:', result.avatarUrl);
  } catch (error) {
    console.error('Upload avatar error:', error);
  }
};
```

## 11. Test Leaderboard Services

### 11.1. Lấy leaderboard
```typescript
import { leaderboardService } from './services';

try {
  const leaderboard = await leaderboardService.getLeaderboard('weekly', 'Toán', 20);
  console.log('Leaderboard:', leaderboard);
  console.log('Current user rank:', leaderboard.currentUser.rank);
} catch (error) {
  console.error('Get leaderboard error:', error);
}
```

### 11.2. Lấy rank của user
```typescript
try {
  const myRank = await leaderboardService.getMyRank('weekly');
  console.log('My rank:', myRank);
  console.log('Percentile:', myRank.percentile);
} catch (error) {
  console.error('Get my rank error:', error);
}
```

## 12. Test Test Library Services

### 12.1. Lấy danh sách tests
```typescript
import { testLibraryService } from './services';

try {
  const library = await testLibraryService.getTestLibrary('Toán', '3', 'official', '', 20, 0);
  console.log('Test library:', library);
  console.log('Tests:', library.tests);
} catch (error) {
  console.error('Get test library error:', error);
}
```

### 12.2. Tạo custom test
```typescript
try {
  const customTest = await testLibraryService.createCustomTest({
    title: 'Custom Test',
    subjects: ['Toán'],
    topics: ['Đại số'],
    difficulty: '3',
    questionsCount: 20,
    timeLimit: 60
  });
  console.log('Custom test created:', customTest);
  console.log('Questions:', customTest.questions);
} catch (error) {
  console.error('Create custom test error:', error);
}
```

### 12.3. Lấy chi tiết test
```typescript
try {
  const test = await testLibraryService.getTestDetails('TEST_ID');
  console.log('Test details:', test);
  console.log('Questions:', test.questions);
} catch (error) {
  console.error('Get test details error:', error);
}
```

## 13. Test trong React Component

### Ví dụ: Dashboard Component
```typescript
import React, { useEffect, useState } from 'react';
import { dashboardService } from './services';

const Dashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!dashboard) return <div>No data</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Streak: {dashboard.stats.studyStreak}</p>
      <p>Today XP: {dashboard.stats.todayXP}</p>
      {/* Render other dashboard data */}
    </div>
  );
};

export default Dashboard;
```

## 14. Test với Browser Console

Mở browser console và test trực tiếp:

```javascript
// Import services (nếu đã setup global)
import { dashboardService } from './services/dashboardService';

// Hoặc test từ window object nếu expose
window.testDashboard = async () => {
  try {
    const data = await dashboardService.getDashboard();
    console.log('Dashboard:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Chạy trong console
await window.testDashboard();
```

## 15. Checklist Test Frontend

### Authentication
- [ ] Đăng ký thành công
- [ ] Đăng nhập và token được lưu
- [ ] Lấy thông tin user
- [ ] Quên mật khẩu
- [ ] Đặt lại mật khẩu
- [ ] Đăng xuất và token bị xóa

### Onboarding
- [ ] Lấy goals và subjects
- [ ] Lấy placement test
- [ ] Submit placement test
- [ ] Hoàn thành onboarding

### Dashboard
- [ ] Lấy dashboard data
- [ ] Hiển thị daily missions
- [ ] Cập nhật mission progress
- [ ] Hiển thị stats

### Streak
- [ ] Hiển thị streak info
- [ ] Cập nhật streak khi hoàn thành activity

### Exam Room
- [ ] Lấy exam modes
- [ ] Bắt đầu exam
- [ ] Submit exam
- [ ] Hiển thị kết quả

### Challenge 5 Min
- [ ] Kiểm tra status
- [ ] Bắt đầu challenge
- [ ] Submit answers với real-time feedback
- [ ] Hoàn thành challenge

### Golden Time
- [ ] Lấy cards cần ôn
- [ ] Bắt đầu session
- [ ] Review cards
- [ ] Hoàn thành session

### Analytics
- [ ] Hiển thị overview
- [ ] Phân tích theo subject
- [ ] Hiển thị progress chart

### Profile
- [ ] Hiển thị profile
- [ ] Cập nhật profile
- [ ] Upload avatar

### Leaderboard
- [ ] Hiển thị leaderboard
- [ ] Hiển thị rank của user

### Test Library
- [ ] Lấy danh sách tests
- [ ] Tạo custom test
- [ ] Xem chi tiết test

## 16. Debug Tips

1. **Check Network Tab**: Xem requests trong DevTools Network tab
2. **Check Console**: Xem errors trong Console
3. **Check localStorage**: Verify token được lưu đúng
4. **Check API Response**: Verify response structure khớp với TypeScript interfaces
5. **Check Error Handling**: Test các trường hợp lỗi (401, 404, 500)

## 17. Common Issues

### Token không được lưu
- Check `authService.login()` có lưu token không
- Check localStorage có bị block không

### CORS Error
- Check backend CORS settings
- Check API base URL trong `api.ts`

### Type Errors
- Check TypeScript interfaces khớp với API response
- Run `npm run type-check` để check types

### 401 Unauthorized
- Check token có hợp lệ không
- Check token có được gửi trong header không

## 18. Test với React Testing Library (nếu có)

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { dashboardService } from './services';
import Dashboard from './Dashboard';

jest.mock('./services');

test('renders dashboard', async () => {
  (dashboardService.getDashboard as jest.Mock).mockResolvedValue({
    stats: { studyStreak: 5, todayXP: 100 }
  });

  render(<Dashboard />);
  
  await waitFor(() => {
    expect(screen.getByText(/Streak: 5/)).toBeInTheDocument();
  });
});
```

