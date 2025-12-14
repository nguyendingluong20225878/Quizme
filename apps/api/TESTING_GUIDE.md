# Hướng Dẫn Test API Backend

## 1. Setup và Khởi động

### Yêu cầu
- Node.js (v14+)
- MongoDB đang chạy
- Environment variables đã được cấu hình

### Khởi động server
```bash
cd apps/api
npm install
npm start
# Hoặc với nodemon
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

## 2. Test Authentication APIs

### 2.1. Đăng ký
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 2.2. Đăng nhập
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

**Lưu token từ response để dùng cho các API protected**

### 2.3. Lấy thông tin user hiện tại
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.4. Quên mật khẩu
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### 2.5. Đặt lại mật khẩu
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "resetToken": "TOKEN_FROM_EMAIL",
    "newPassword": "newpassword123"
  }'
```

### 2.6. Đăng xuất
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 3. Test Onboarding APIs

### 3.1. Lấy danh sách mục tiêu
```bash
curl -X GET http://localhost:5000/api/onboarding/goals
```

### 3.2. Lấy danh sách môn học
```bash
curl -X GET http://localhost:5000/api/onboarding/subjects
```

### 3.3. Lấy placement test
```bash
curl -X GET http://localhost:5000/api/onboarding/placement-test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.4. Submit placement test
```bash
curl -X POST http://localhost:5000/api/onboarding/placement-test/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": "QUESTION_ID_1", "answer": "A"},
      {"questionId": "QUESTION_ID_2", "answer": "B"}
    ]
  }'
```

### 3.5. Hoàn thành onboarding
```bash
curl -X POST http://localhost:5000/api/onboarding/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "goals": ["Nâng cao điểm số", "Ôn tập cho kỳ thi"],
    "subjects": ["Toán", "Lý"],
    "placementLevel": 5
  }'
```

## 4. Test Dashboard APIs

### 4.1. Lấy dashboard tổng hợp
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.2. Lấy nhiệm vụ hàng ngày
```bash
curl -X GET http://localhost:5000/api/dashboard/daily-missions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4.3. Cập nhật tiến độ nhiệm vụ
```bash
curl -X POST http://localhost:5000/api/dashboard/daily-missions/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "missionId": "MISSION_ID",
    "progress": 5
  }'
```

### 4.4. Lấy thống kê
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 5. Test Study Streak APIs

### 5.1. Lấy thông tin streak
```bash
curl -X GET http://localhost:5000/api/streak \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5.2. Cập nhật streak
```bash
curl -X POST http://localhost:5000/api/streak/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "activityType": "challenge"
  }'
```

## 6. Test Exam Room APIs

### 6.1. Lấy danh sách mode thi
```bash
curl -X GET http://localhost:5000/api/exam-room/modes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6.2. Bắt đầu bài thi
```bash
curl -X POST http://localhost:5000/api/exam-room/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "sprint",
    "subjects": ["Toán"]
  }'
```

### 6.3. Submit bài thi
```bash
curl -X POST http://localhost:5000/api/exam-room/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "examId": "EXAM_ID",
    "mode": "sprint",
    "answers": [
      {"questionId": "Q1", "answer": "A", "timeSpent": 30},
      {"questionId": "Q2", "answer": "B", "timeSpent": 45}
    ]
  }'
```

### 6.4. Lấy kết quả bài thi
```bash
curl -X GET http://localhost:5000/api/exam-room/results/RESULT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6.5. Lấy lịch sử thi
```bash
curl -X GET "http://localhost:5000/api/exam-room/history?mode=sprint&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 7. Test Challenge 5 Min APIs

### 7.1. Kiểm tra trạng thái challenge
```bash
curl -X GET http://localhost:5000/api/challenge-5min/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7.2. Bắt đầu challenge
```bash
curl -X POST http://localhost:5000/api/challenge-5min/start \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7.3. Submit câu trả lời
```bash
curl -X POST http://localhost:5000/api/challenge-5min/submit-answer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "challengeId": "CHALLENGE_ID",
    "questionId": "QUESTION_ID",
    "answer": "A",
    "timeSpent": 30
  }'
```

### 7.4. Hoàn thành challenge
```bash
curl -X POST http://localhost:5000/api/challenge-5min/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "challengeId": "CHALLENGE_ID",
    "finalScore": 80
  }'
```

## 8. Test Golden Time APIs

### 8.1. Lấy danh sách flashcards
```bash
curl -X GET http://localhost:5000/api/golden-time/cards \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8.2. Bắt đầu session
```bash
curl -X POST http://localhost:5000/api/golden-time/start-session \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cardIds": ["CARD_ID_1", "CARD_ID_2"]
  }'
```

### 8.3. Review flashcard
```bash
curl -X POST http://localhost:5000/api/golden-time/review \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID",
    "cardId": "CARD_ID",
    "remembered": true,
    "confidenceLevel": 4
  }'
```

### 8.4. Hoàn thành session
```bash
curl -X POST http://localhost:5000/api/golden-time/complete-session \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "SESSION_ID"
  }'
```

## 9. Test Analytics APIs

### 9.1. Lấy dữ liệu phân tích tổng quan
```bash
curl -X GET http://localhost:5000/api/analytics/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9.2. Phân tích theo môn học
```bash
curl -X GET http://localhost:5000/api/analytics/subjects/Toán \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 9.3. Phân tích tiến độ
```bash
curl -X GET "http://localhost:5000/api/analytics/progress?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 10. Test Profile APIs

### 10.1. Lấy thông tin profile
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 10.2. Cập nhật profile (qua /api/users/me)
```bash
curl -X PUT http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "goals": ["Goal 1", "Goal 2"]
  }'
```

### 10.3. Upload avatar
```bash
curl -X POST http://localhost:5000/api/profile/avatar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

## 11. Test Achievements APIs

### 11.1. Lấy danh sách achievements
```bash
curl -X GET http://localhost:5000/api/achievements \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 11.2. Unlock achievement
```bash
curl -X POST http://localhost:5000/api/achievements/unlock \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "achievementId": "ACHIEVEMENT_ID"
  }'
```

## 12. Test Leaderboard APIs

### 12.1. Lấy bảng xếp hạng
```bash
curl -X GET "http://localhost:5000/api/leaderboard?mode=weekly&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 12.2. Lấy vị trí của user
```bash
curl -X GET "http://localhost:5000/api/leaderboard/my-rank?mode=weekly" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 13. Test Test Library APIs

### 13.1. Lấy danh sách đề thi
```bash
curl -X GET "http://localhost:5000/api/tests/library?subject=Toán&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 13.2. Tạo custom test
```bash
curl -X POST http://localhost:5000/api/tests/custom/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Custom Test",
    "subjects": ["Toán"],
    "topics": ["Đại số"],
    "difficulty": "3",
    "questionsCount": 20,
    "timeLimit": 60
  }'
```

### 13.3. Lấy chi tiết đề thi
```bash
curl -X GET http://localhost:5000/api/tests/TEST_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 14. Test Learning Roadmap APIs

### 14.1. Hoàn thành Boss Challenge
```bash
curl -X POST http://localhost:5000/api/roadmap/stages/STAGE_ID/boss/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 85,
    "timeTaken": 1200
  }'
```

## 15. Test User APIs

### 15.1. Lấy thông tin user hiện tại
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 15.2. Cập nhật user
```bash
curl -X PUT http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

## 16. Checklist Test

### Authentication
- [ ] Đăng ký thành công
- [ ] Đăng nhập thành công và nhận token
- [ ] Lấy thông tin user hiện tại
- [ ] Quên mật khẩu (check email hoặc console log)
- [ ] Đặt lại mật khẩu
- [ ] Đăng xuất

### Onboarding
- [ ] Lấy danh sách goals
- [ ] Lấy danh sách subjects
- [ ] Lấy placement test
- [ ] Submit placement test và nhận level
- [ ] Hoàn thành onboarding

### Dashboard
- [ ] Lấy dashboard tổng hợp
- [ ] Lấy daily missions
- [ ] Cập nhật mission progress
- [ ] Mission tự động complete khi đạt 100%
- [ ] Lấy stats

### Streak
- [ ] Lấy thông tin streak
- [ ] Cập nhật streak khi hoàn thành activity
- [ ] Nhận bonus XP khi đạt milestone

### Exam Room
- [ ] Lấy danh sách modes
- [ ] Bắt đầu exam
- [ ] Submit exam và nhận kết quả
- [ ] Lấy kết quả chi tiết
- [ ] Lấy lịch sử thi

### Challenge 5 Min
- [ ] Kiểm tra status
- [ ] Bắt đầu challenge
- [ ] Submit answer và nhận feedback
- [ ] Hoàn thành challenge

### Golden Time
- [ ] Lấy cards cần ôn
- [ ] Bắt đầu session
- [ ] Review card
- [ ] Hoàn thành session

### Analytics
- [ ] Lấy overview
- [ ] Phân tích theo subject
- [ ] Phân tích progress theo thời gian

### Profile
- [ ] Lấy profile
- [ ] Cập nhật profile
- [ ] Upload avatar

### Achievements
- [ ] Lấy danh sách achievements
- [ ] Unlock achievement

### Leaderboard
- [ ] Lấy leaderboard (weekly/monthly/alltime)
- [ ] Lấy rank của user

### Test Library
- [ ] Lấy danh sách tests
- [ ] Tạo custom test
- [ ] Lấy chi tiết test

### Roadmap
- [ ] Hoàn thành boss challenge

## 17. Test với Postman

1. Import collection từ file `QuizMe_API.postman_collection.json` (nếu có)
2. Set environment variable `token` sau khi login
3. Chạy các requests theo thứ tự

## 18. Test với Jest (nếu có)

```bash
npm test
```

## 19. Lưu ý khi test

1. **Token**: Lưu token sau khi login để dùng cho các API protected
2. **IDs**: Thay thế các ID placeholder (USER_ID, EXAM_ID, etc.) bằng ID thực tế
3. **Database**: Đảm bảo có dữ liệu mẫu trong database
4. **CORS**: Kiểm tra CORS settings nếu test từ browser
5. **Error handling**: Test các trường hợp lỗi (invalid token, missing fields, etc.)

## 20. Debug Tips

- Check console logs trong server
- Check MongoDB để xem dữ liệu có được lưu đúng không
- Sử dụng Postman Console để xem request/response chi tiết
- Check network tab trong browser DevTools khi test từ frontend

