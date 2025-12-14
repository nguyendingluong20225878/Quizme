# 🚀 PROMPT: Hoàn Thiện Backend QuizMe để Kết Nối với Frontend

> **Mục tiêu:** Hoàn thiện Backend API để Frontend có thể kết nối hoàn chỉnh, loại bỏ toàn bộ mock data.

---

## 📋 CONTEXT

### Backend Hiện Tại (Đã có ✅)

**Tech Stack:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- RESTful API

**APIs Đã Implement:**
```
✅ Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

✅ User Management
GET  /api/users/me
PUT  /api/users/me
GET  /api/users/me/xp
POST /api/users/me/xp/add
GET  /api/users/me/xp/history

✅ Streak System (Basic)
GET  /api/users/me/streak
POST /api/users/me/streak/checkin

✅ Exams & Questions
GET  /api/exams
GET  /api/exams/:id
POST /api/exams (admin)
POST /api/exams/factory
GET  /api/questions
POST /api/questions (admin)

✅ Exam Attempts
POST /api/exam-attempts/start
PUT  /api/exam-attempts/:id/answer
POST /api/exam-attempts/:id/submit
GET  /api/exam-attempts
GET  /api/exam-attempts/:id

✅ Achievements
GET  /api/achievements
GET  /api/achievements/progress
POST /api/achievements/:id/unlock

✅ Missions
GET  /api/missions/daily
PATCH /api/missions/:id/progress
POST /api/missions/:id/complete

✅ Leaderboard
GET  /api/leaderboard/weekly
GET  /api/leaderboard/monthly
GET  /api/leaderboard/alltime
GET  /api/leaderboard/friends

✅ Content Management
GET  /api/subjects
GET  /api/topics
GET  /api/formulas
GET  /api/videos
GET  /api/tips
```

---

## 🎯 YÊU CẦU HOÀN THIỆN

### Frontend Đã Sẵn Sàng

Frontend đã được xây dựng với **Service Layer hoàn chỉnh** và đang chờ Backend APIs:

```
/services/
├── authService.ts       ✅ Đã connect
├── userService.ts       ✅ Đã connect  
├── missionService.ts    ⏳ Cần APIs mới
├── examService.ts       ⏳ Cần cải thiện
├── challengeService.ts  ❌ Cần tạo mới
├── flashcardService.ts  ❌ Cần tạo mới
├── analyticsService.ts  ❌ Cần tạo mới
├── roadmapService.ts    ❌ Cần tạo mới
├── leaderboardService.ts ✅ Đã có
├── achievementService.ts ✅ Đã có
└── aiTeacherService.ts  🤖 Mock AI OK
```

---

## 🔴 CRITICAL APIS - Phải Có Ngay (Week 1-2)

### 1. Challenge 5 Phút System

**Mục đích:** Feature "Challenge 5 Phút" trên Dashboard - học sinh làm 5 câu hỏi mỗi ngày

#### Models Cần Tạo:

```javascript
// models/DailyChallenge.js
const dailyChallengeSchema = new Schema({
  date: { type: Date, required: true, unique: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // 5 questions
  difficulty: { type: String, enum: ['mixed'], default: 'mixed' },
  timeLimit: { type: Number, default: 300 }, // 5 phút = 300 seconds
  xpReward: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now }
});

// Index để query nhanh
dailyChallengeSchema.index({ date: -1 });

// models/ChallengeAttempt.js
const challengeAttemptSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'DailyChallenge', required: true },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    answer: Number,
    timeSpent: Number // seconds
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, default: 5 },
  correctAnswers: { type: Number, required: true },
  timeSpent: { type: Number, required: true }, // total seconds
  completedAt: { type: Date, default: Date.now },
  xpEarned: { type: Number, default: 0 },
  isDaily: { type: Boolean, default: true }
});

// Index
challengeAttemptSchema.index({ user: 1, completedAt: -1 });
challengeAttemptSchema.index({ user: 1, challenge: 1 }, { unique: true }); // 1 user chỉ làm 1 lần/challenge
```

#### Endpoints Cần Implement:

**1.1. GET /api/challenges/daily**
```javascript
/**
 * Lấy daily challenge hôm nay
 * - Tự động tạo challenge mới nếu chưa có cho ngày hôm nay
 * - Chọn random 5 questions (mixed difficulty)
 * - Check user đã complete chưa
 */

// Response:
{
  "success": true,
  "data": {
    "id": "challenge_id",
    "date": "2025-12-01",
    "questions": [
      {
        "id": "q1",
        "question": "Tính đạo hàm của y = x² + 3x - 5",
        "options": ["2x + 3", "x + 3", "2x - 3", "x² + 3"],
        "difficulty": "medium",
        "topic": "Đạo Hàm"
        // KHÔNG trả về correctAnswer
      },
      // ... 4 questions nữa
    ],
    "timeLimit": 300,
    "xpReward": 50,
    "completed": false // user đã làm chưa
  }
}

// Implementation:
router.get('/daily', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tìm hoặc tạo challenge hôm nay
    let challenge = await DailyChallenge.findOne({ date: today })
      .populate('questions', '-correctAnswer -explanation'); // Không trả về đáp án

    if (!challenge) {
      // Tạo challenge mới
      const questions = await Question.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 5 } } // Random 5 câu
      ]);

      challenge = await DailyChallenge.create({
        date: today,
        questions: questions.map(q => q._id),
        timeLimit: 300,
        xpReward: 50
      });

      challenge = await challenge.populate('questions', '-correctAnswer -explanation');
    }

    // Check user đã complete chưa
    const attempt = await ChallengeAttempt.findOne({
      user: req.user._id,
      challenge: challenge._id
    });

    res.json({
      success: true,
      data: {
        ...challenge.toObject(),
        completed: !!attempt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**1.2. POST /api/challenges/start**
```javascript
/**
 * Bắt đầu challenge (tạo attempt record)
 * Body: { challengeId: string }
 */

// Response:
{
  "success": true,
  "data": {
    "attempt": {
      "id": "attempt_id",
      "challenge": "challenge_id",
      "user": "user_id",
      "answers": [],
      "startedAt": "2025-12-01T10:00:00.000Z"
    },
    "challenge": { /* full challenge data với questions */ }
  }
}

// Implementation:
router.post('/start', auth, async (req, res) => {
  try {
    const { challengeId } = req.body;

    // Check đã làm chưa
    const existing = await ChallengeAttempt.findOne({
      user: req.user._id,
      challenge: challengeId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã hoàn thành challenge này rồi'
      });
    }

    const challenge = await Challenge.findById(challengeId)
      .populate('questions', '-correctAnswer -explanation');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge không tồn tại'
      });
    }

    const attempt = await ChallengeAttempt.create({
      user: req.user._id,
      challenge: challengeId,
      answers: [],
      score: 0,
      correctAnswers: 0,
      timeSpent: 0
    });

    res.json({
      success: true,
      data: { attempt, challenge }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**1.3. POST /api/challenges/:id/submit**
```javascript
/**
 * Nộp kết quả challenge
 * Body: {
 *   answers: [{ questionId: string, answer: number, timeSpent: number }]
 * }
 */

// Response:
{
  "success": true,
  "data": {
    "attempt": { /* full attempt */ },
    "score": 80, // percentage
    "xpEarned": 50,
    "newStreak": 5, // challenge streak
    "results": [
      {
        "questionId": "q1",
        "correct": true,
        "userAnswer": 0,
        "correctAnswer": 0,
        "explanation": "..."
      },
      // ...
    ]
  }
}

// Implementation:
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const challengeId = req.params.id;

    const challenge = await DailyChallenge.findById(challengeId)
      .populate('questions');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge không tồn tại'
      });
    }

    // Tính điểm
    let correctAnswers = 0;
    let totalTimeSpent = 0;
    const results = [];

    answers.forEach(ans => {
      const question = challenge.questions.find(q => 
        q._id.toString() === ans.questionId
      );
      
      const isCorrect = question.correctAnswer === ans.answer;
      if (isCorrect) correctAnswers++;
      totalTimeSpent += ans.timeSpent || 0;

      results.push({
        questionId: ans.questionId,
        correct: isCorrect,
        userAnswer: ans.answer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctAnswers / challenge.questions.length) * 100);

    // Update attempt
    const attempt = await ChallengeAttempt.findOneAndUpdate(
      { user: req.user._id, challenge: challengeId },
      {
        answers,
        score,
        correctAnswers,
        timeSpent: totalTimeSpent,
        completedAt: new Date(),
        xpEarned: challenge.xpReward
      },
      { new: true, upsert: true }
    );

    // Add XP to user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: challenge.xpReward }
    });

    // Log XP history
    await XPHistory.create({
      user: req.user._id,
      amount: challenge.xpReward,
      source: 'challenge',
      description: 'Hoàn thành Challenge 5 Phút'
    });

    // Calculate challenge streak
    const streak = await calculateChallengeStreak(req.user._id);

    res.json({
      success: true,
      data: {
        attempt,
        score,
        xpEarned: challenge.xpReward,
        newStreak: streak,
        results
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function
async function calculateChallengeStreak(userId) {
  const attempts = await ChallengeAttempt.find({ user: userId })
    .populate('challenge')
    .sort({ completedAt: -1 })
    .limit(100);

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const attempt of attempts) {
    const attemptDate = new Date(attempt.challenge.date);
    attemptDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate - attemptDate) / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
```

**1.4. GET /api/challenges/history**
```javascript
/**
 * Lịch sử challenges
 * Query: ?limit=10
 */

router.get('/history', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const attempts = await ChallengeAttempt.find({ user: req.user._id })
      .populate('challenge')
      .sort({ completedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: attempts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**1.5. GET /api/challenges/streak**
```javascript
/**
 * Challenge streak stats
 */

router.get('/streak', auth, async (req, res) => {
  try {
    const attempts = await ChallengeAttempt.find({ user: req.user._id })
      .populate('challenge')
      .sort({ completedAt: -1 });

    const currentStreak = await calculateChallengeStreak(req.user._id);
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    attempts.forEach(attempt => {
      const attemptDate = new Date(attempt.challenge.date);
      attemptDate.setHours(0, 0, 0, 0);

      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.floor((prevDate - attemptDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      prevDate = attemptDate;
    });

    longestStreak = Math.max(longestStreak, tempStreak);

    res.json({
      success: true,
      data: {
        currentStreak,
        longestStreak,
        totalCompleted: attempts.length,
        lastCompletedDate: attempts.length > 0 ? attempts[0].completedAt : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

### 2. Exam Attempt Analysis (Cải thiện API có sẵn)

**Mục đích:** Phân tích chi tiết lỗi sai theo độ khó, loại câu hỏi, topic

#### Endpoint Cần Thêm:

**2.1. GET /api/exam-attempts/:id/analysis**
```javascript
/**
 * Phân tích chi tiết 1 exam attempt
 */

// Response:
{
  "success": true,
  "data": {
    "attemptId": "...",
    "overallScore": 75,
    "byDifficulty": [
      {
        "difficulty": "easy",
        "correct": 5,
        "incorrect": 1,
        "total": 6,
        "percentage": 83.33
      },
      {
        "difficulty": "medium",
        "correct": 3,
        "incorrect": 2,
        "total": 5,
        "percentage": 60
      },
      {
        "difficulty": "hard",
        "correct": 1,
        "incorrect": 3,
        "total": 4,
        "percentage": 25
      }
    ],
    "byQuestionType": [
      {
        "type": "recognition",
        "correct": 4,
        "incorrect": 1,
        "total": 5,
        "percentage": 80
      },
      {
        "type": "application",
        "correct": 3,
        "incorrect": 2,
        "total": 5,
        "percentage": 60
      }
      // comprehension, analysis
    ],
    "byTopic": [
      {
        "topic": "Đạo Hàm",
        "correct": 4,
        "incorrect": 2,
        "total": 6,
        "percentage": 66.67
      }
      // ...
    ],
    "weakAreas": [
      {
        "topic": "Logarit",
        "difficulty": "hard",
        "score": 25
      }
    ],
    "avgTimePerQuestion": 45.5, // seconds
    "improvementTrend": "improving" // improving/stable/declining
  }
}

// Implementation:
router.get('/:id/analysis', auth, async (req, res) => {
  try {
    const attempt = await ExamAttempt.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate({
      path: 'exam',
      populate: { path: 'questions' }
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt không tồn tại'
      });
    }

    const questions = attempt.exam.questions;

    // Analysis by difficulty
    const byDifficulty = {};
    const byQuestionType = {};
    const byTopic = {};

    questions.forEach((question, index) => {
      const userAnswer = attempt.answers[index];
      const isCorrect = userAnswer?.answer === question.correctAnswer;

      // By Difficulty
      if (!byDifficulty[question.difficulty]) {
        byDifficulty[question.difficulty] = { correct: 0, incorrect: 0, total: 0 };
      }
      byDifficulty[question.difficulty].total++;
      if (isCorrect) {
        byDifficulty[question.difficulty].correct++;
      } else {
        byDifficulty[question.difficulty].incorrect++;
      }

      // By Question Type
      const qType = question.questionType || 'recognition';
      if (!byQuestionType[qType]) {
        byQuestionType[qType] = { correct: 0, incorrect: 0, total: 0 };
      }
      byQuestionType[qType].total++;
      if (isCorrect) {
        byQuestionType[qType].correct++;
      } else {
        byQuestionType[qType].incorrect++;
      }

      // By Topic
      if (!byTopic[question.topic]) {
        byTopic[question.topic] = { correct: 0, incorrect: 0, total: 0 };
      }
      byTopic[question.topic].total++;
      if (isCorrect) {
        byTopic[question.topic].correct++;
      } else {
        byTopic[question.topic].incorrect++;
      }
    });

    // Format results
    const byDifficultyArray = Object.entries(byDifficulty).map(([difficulty, stats]) => ({
      difficulty,
      ...stats,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    const byQuestionTypeArray = Object.entries(byQuestionType).map(([type, stats]) => ({
      type,
      ...stats,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    const byTopicArray = Object.entries(byTopic).map(([topic, stats]) => ({
      topic,
      ...stats,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    // Weak areas (< 50% score)
    const weakAreas = byTopicArray
      .filter(t => t.percentage < 50)
      .map(t => ({
        topic: t.topic,
        difficulty: 'mixed',
        score: t.percentage
      }));

    // Avg time per question
    const totalTime = attempt.answers.reduce((sum, ans) => sum + (ans.timeSpent || 0), 0);
    const avgTimePerQuestion = totalTime / attempt.answers.length;

    res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        overallScore: attempt.score,
        byDifficulty: byDifficultyArray,
        byQuestionType: byQuestionTypeArray,
        byTopic: byTopicArray,
        weakAreas,
        avgTimePerQuestion: Math.round(avgTimePerQuestion * 10) / 10
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**2.2. GET /api/exam-attempts/my-performance**
```javascript
/**
 * Tổng hợp performance của user qua tất cả attempts
 */

// Response:
{
  "success": true,
  "data": {
    "overallAccuracy": 72.5,
    "totalAttempts": 15,
    "averageScore": 75.3,
    "byTopic": [
      {
        "topic": "Đạo Hàm",
        "accuracy": 85.2,
        "attempts": 10
      },
      {
        "topic": "Logarit",
        "accuracy": 62.1,
        "attempts": 8
      }
    ],
    "recentTrend": [
      { "date": "2025-11-25", "score": 70 },
      { "date": "2025-11-27", "score": 75 },
      { "date": "2025-11-30", "score": 80 }
    ],
    "weakAreas": [
      {
        "topic": "Logarit",
        "difficulty": "hard",
        "score": 45.5
      }
    ]
  }
}

// Implementation:
router.get('/my-performance', auth, async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ user: req.user._id })
      .populate({
        path: 'exam',
        populate: { path: 'questions' }
      })
      .sort({ completedAt: -1 });

    if (attempts.length === 0) {
      return res.json({
        success: true,
        data: {
          overallAccuracy: 0,
          totalAttempts: 0,
          averageScore: 0,
          byTopic: [],
          recentTrend: [],
          weakAreas: []
        }
      });
    }

    // Calculate overall stats
    const totalScore = attempts.reduce((sum, att) => sum + att.score, 0);
    const averageScore = totalScore / attempts.length;

    // By Topic
    const topicStats = {};
    
    attempts.forEach(attempt => {
      attempt.exam.questions.forEach((question, idx) => {
        const userAnswer = attempt.answers[idx];
        const isCorrect = userAnswer?.answer === question.correctAnswer;

        if (!topicStats[question.topic]) {
          topicStats[question.topic] = { correct: 0, total: 0, attempts: new Set() };
        }

        topicStats[question.topic].total++;
        if (isCorrect) topicStats[question.topic].correct++;
        topicStats[question.topic].attempts.add(attempt._id.toString());
      });
    });

    const byTopic = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      accuracy: Math.round((stats.correct / stats.total) * 100 * 10) / 10,
      attempts: stats.attempts.size
    })).sort((a, b) => b.accuracy - a.accuracy);

    // Recent trend (last 7 attempts)
    const recentTrend = attempts.slice(0, 7).reverse().map(att => ({
      date: att.completedAt.toISOString().split('T')[0],
      score: att.score
    }));

    // Weak areas (topics < 60% accuracy)
    const weakAreas = byTopic
      .filter(t => t.accuracy < 60)
      .map(t => ({
        topic: t.topic,
        difficulty: 'mixed',
        score: t.accuracy
      }));

    res.json({
      success: true,
      data: {
        overallAccuracy: Math.round(averageScore * 10) / 10,
        totalAttempts: attempts.length,
        averageScore: Math.round(averageScore * 10) / 10,
        byTopic,
        recentTrend,
        weakAreas
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

### 3. Analytics API (Cho Analytics Dashboard)

**Mục đích:** Cung cấp data cho các charts trong Analytics Dashboard

#### Endpoints:

**3.1. GET /api/analytics/competency-radar**
```javascript
/**
 * Competency radar chart data (điểm mạnh/yếu theo môn)
 */

// Response:
{
  "success": true,
  "data": [
    {
      "subject": "Toán",
      "score": 85,
      "fullMark": 100,
      "attempts": 20
    },
    {
      "subject": "Vật Lý",
      "score": 72,
      "fullMark": 100,
      "attempts": 15
    }
    // ... more subjects
  ]
}

// Implementation:
router.get('/competency-radar', auth, async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ user: req.user._id })
      .populate('exam');

    const subjectStats = {};

    attempts.forEach(attempt => {
      const subject = attempt.exam.subject;
      
      if (!subjectStats[subject]) {
        subjectStats[subject] = { totalScore: 0, count: 0 };
      }

      subjectStats[subject].totalScore += attempt.score;
      subjectStats[subject].count++;
    });

    const data = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      score: Math.round(stats.totalScore / stats.count),
      fullMark: 100,
      attempts: stats.count
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**3.2. GET /api/analytics/error-analysis/by-difficulty**

```javascript
/**
 * Error analysis by difficulty
 */

router.get('/error-analysis/by-difficulty', auth, async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ user: req.user._id })
      .populate({
        path: 'exam',
        populate: { path: 'questions' }
      });

    const difficultyStats = {
      easy: { correct: 0, incorrect: 0, total: 0 },
      medium: { correct: 0, incorrect: 0, total: 0 },
      hard: { correct: 0, incorrect: 0, total: 0 }
    };

    attempts.forEach(attempt => {
      attempt.exam.questions.forEach((question, idx) => {
        const userAnswer = attempt.answers[idx];
        const isCorrect = userAnswer?.answer === question.correctAnswer;
        const difficulty = question.difficulty || 'medium';

        if (difficultyStats[difficulty]) {
          difficultyStats[difficulty].total++;
          if (isCorrect) {
            difficultyStats[difficulty].correct++;
          } else {
            difficultyStats[difficulty].incorrect++;
          }
        }
      });
    });

    const data = Object.entries(difficultyStats).map(([difficulty, stats]) => ({
      difficulty,
      ...stats,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      color: difficulty === 'easy' ? '#10b981' : difficulty === 'medium' ? '#f59e0b' : '#ef4444'
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**3.3. GET /api/analytics/error-analysis/by-type**

```javascript
/**
 * Error analysis by question type
 */

router.get('/error-analysis/by-type', auth, async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ user: req.user._id })
      .populate({
        path: 'exam',
        populate: { path: 'questions' }
      });

    const typeStats = {
      recognition: { correct: 0, incorrect: 0, total: 0 },
      comprehension: { correct: 0, incorrect: 0, total: 0 },
      application: { correct: 0, incorrect: 0, total: 0 },
      analysis: { correct: 0, incorrect: 0, total: 0 }
    };

    const typeIcons = {
      recognition: '🎯',
      comprehension: '🧠',
      application: '⚡',
      analysis: '🔬'
    };

    const typeColors = {
      recognition: '#06b6d4',
      comprehension: '#8b5cf6',
      application: '#ec4899',
      analysis: '#f97316'
    };

    attempts.forEach(attempt => {
      attempt.exam.questions.forEach((question, idx) => {
        const userAnswer = attempt.answers[idx];
        const isCorrect = userAnswer?.answer === question.correctAnswer;
        const type = question.questionType || 'recognition';

        if (typeStats[type]) {
          typeStats[type].total++;
          if (isCorrect) {
            typeStats[type].correct++;
          } else {
            typeStats[type].incorrect++;
          }
        }
      });
    });

    const data = Object.entries(typeStats).map(([type, stats]) => ({
      type,
      ...stats,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      icon: typeIcons[type],
      color: typeColors[type]
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**3.4. GET /api/analytics/progress-trend**

```javascript
/**
 * Progress trend over time
 * Query: ?period=week|month
 */

router.get('/progress-trend', auth, async (req, res) => {
  try {
    const period = req.query.period || 'week';
    const days = period === 'week' ? 7 : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const attempts = await ExamAttempt.find({
      user: req.user._id,
      completedAt: { $gte: startDate }
    }).sort({ completedAt: 1 });

    // Group by date
    const trendMap = {};

    attempts.forEach(attempt => {
      const date = attempt.completedAt.toISOString().split('T')[0];
      
      if (!trendMap[date]) {
        trendMap[date] = { totalScore: 0, count: 0 };
      }

      trendMap[date].totalScore += attempt.score;
      trendMap[date].count++;
    });

    const data = Object.entries(trendMap).map(([date, stats]) => ({
      date,
      score: Math.round(stats.totalScore / stats.count)
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**3.5. GET /api/analytics/weak-topics**

```javascript
/**
 * Weak topics (điểm yếu cần cải thiện)
 * Query: ?limit=3
 */

router.get('/weak-topics', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const attempts = await ExamAttempt.find({ user: req.user._id })
      .populate({
        path: 'exam',
        populate: { path: 'questions' }
      });

    const topicStats = {};

    attempts.forEach(attempt => {
      attempt.exam.questions.forEach((question, idx) => {
        const userAnswer = attempt.answers[idx];
        const isCorrect = userAnswer?.answer === question.correctAnswer;

        if (!topicStats[question.topic]) {
          topicStats[question.topic] = {
            correct: 0,
            wrong: 0,
            total: 0,
            commonErrors: []
          };
        }

        topicStats[question.topic].total++;
        
        if (isCorrect) {
          topicStats[question.topic].correct++;
        } else {
          topicStats[question.topic].wrong++;
          topicStats[question.topic].commonErrors.push(question.question);
        }
      });
    });

    const weakTopics = Object.entries(topicStats)
      .map(([topic, stats]) => ({
        id: topic.toLowerCase().replace(/\s+/g, '-'),
        topic,
        score: Math.round((stats.correct / stats.total) * 100),
        trend: 'stable', // TODO: Calculate trend
        wrongQuestions: stats.wrong,
        totalQuestions: stats.total,
        commonErrors: stats.commonErrors.slice(0, 3),
        icon: '📚'
      }))
      .filter(t => t.score < 70) // Only topics < 70%
      .sort((a, b) => a.score - b.score)
      .slice(0, limit);

    res.json({ success: true, data: weakTopics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

## 🟡 HIGH PRIORITY APIS (Week 3-4)

### 4. Flashcard System (Golden Time)

**Mục đích:** Spaced Repetition cho công thức

#### Models:

```javascript
// models/FlashcardProgress.js
const flashcardProgressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  formula: { type: Schema.Types.ObjectId, ref: 'Formula', required: true },
  lastReviewedAt: { type: Date },
  nextReviewAt: { type: Date, required: true },
  easeFactor: { type: Number, default: 2.5 }, // SM-2 algorithm
  interval: { type: Number, default: 1 }, // days
  repetitions: { type: Number, default: 0 },
  lapses: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

flashcardProgressSchema.index({ user: 1, nextReviewAt: 1 });
flashcardProgressSchema.index({ user: 1, formula: 1 }, { unique: true });
```

#### Endpoints:

**4.1. GET /api/flashcards/me/due**

```javascript
/**
 * Lấy flashcards cần ôn hôm nay (Golden Time)
 */

// Response:
{
  "success": true,
  "data": [
    {
      "id": "progress_id",
      "formula": {
        "id": "formula_id",
        "name": "Công thức đạo hàm cơ bản",
        "latex": "(x^n)' = nx^{n-1}",
        "description": "Đạo hàm của x mũ n",
        "topic": "Đạo Hàm"
      },
      "lastReviewedAt": "2025-11-28",
      "nextReviewAt": "2025-12-01",
      "easeFactor": 2.5,
      "interval": 3,
      "repetitions": 2,
      "dueStatus": "overdue", // overdue | due-today | due-soon
      "hoursUntilDue": -5 // negative = overdue
    }
  ]
}

// Implementation:
router.get('/me/due', auth, async (req, res) => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueFlashcards = await FlashcardProgress.find({
      user: req.user._id,
      nextReviewAt: { $lte: tomorrow }
    })
    .populate('formula')
    .sort({ nextReviewAt: 1 });

    const data = dueFlashcards.map(fp => {
      const hoursUntilDue = (fp.nextReviewAt - now) / (1000 * 60 * 60);
      
      let dueStatus;
      if (hoursUntilDue < 0) dueStatus = 'overdue';
      else if (hoursUntilDue < 6) dueStatus = 'due-soon';
      else dueStatus = 'due-today';

      return {
        id: fp._id,
        formula: fp.formula,
        lastReviewedAt: fp.lastReviewedAt,
        nextReviewAt: fp.nextReviewAt,
        easeFactor: fp.easeFactor,
        interval: fp.interval,
        repetitions: fp.repetitions,
        dueStatus,
        hoursUntilDue: Math.round(hoursUntilDue * 10) / 10
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**4.2. POST /api/flashcards/:id/rate**

```javascript
/**
 * Rate flashcard difficulty (SM-2 Algorithm)
 * Body: { rating: 0|1|2 }  // 0=Hard, 1=Good, 2=Easy
 */

router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body; // 0, 1, or 2

    let progress = await FlashcardProgress.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('formula');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard progress không tồn tại'
      });
    }

    // SM-2 Algorithm
    let { easeFactor, interval, repetitions } = progress;

    // Update ease factor based on rating
    if (rating === 0) { // Hard
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      repetitions = 0;
      interval = 1;
    } else if (rating === 1) { // Good
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      repetitions++;
      
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round(interval * easeFactor);
    } else { // Easy
      easeFactor = Math.min(2.5, easeFactor + 0.1);
      repetitions++;
      
      if (repetitions === 1) interval = 4;
      else interval = Math.round(interval * easeFactor * 1.3);
    }

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    progress.easeFactor = easeFactor;
    progress.interval = interval;
    progress.repetitions = repetitions;
    progress.lastReviewedAt = new Date();
    progress.nextReviewAt = nextReviewAt;

    if (rating === 0) {
      progress.lapses++;
    }

    await progress.save();

    // Award XP
    const xpEarned = rating === 2 ? 15 : rating === 1 ? 10 : 5;
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: xpEarned }
    });

    res.json({
      success: true,
      data: {
        flashcard: progress,
        nextReviewAt,
        xpEarned
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**4.3. GET /api/flashcards/me/stats**

```javascript
/**
 * Flashcard stats
 */

router.get('/me/stats', auth, async (req, res) => {
  try {
    const allProgress = await FlashcardProgress.find({ user: req.user._id });

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));

    const stats = {
      totalCards: allProgress.length,
      masteredCards: allProgress.filter(fp => fp.repetitions >= 3 && fp.interval >= 7).length,
      learningCards: allProgress.filter(fp => fp.repetitions > 0 && fp.repetitions < 3).length,
      newCards: allProgress.filter(fp => fp.repetitions === 0).length,
      dueToday: allProgress.filter(fp => fp.nextReviewAt <= new Date()).length,
      reviewsToday: 0, // TODO: Count reviews from today
      streak: 0 // TODO: Calculate flashcard streak
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**4.4. POST /api/flashcards/:id/review**

```javascript
/**
 * Mark flashcard as reviewed (before rating)
 */

router.post('/:id/review', auth, async (req, res) => {
  try {
    const progress = await FlashcardProgress.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { lastReviewedAt: new Date() },
      { new: true }
    ).populate('formula');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard progress không tồn tại'
      });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**4.5. GET /api/flashcards/formulas**

```javascript
/**
 * Lấy tất cả formulas (để init flashcards)
 */

router.get('/formulas', auth, async (req, res) => {
  try {
    const formulas = await Formula.find({ isActive: true });

    // Create flashcard progress for new formulas
    for (const formula of formulas) {
      await FlashcardProgress.findOneAndUpdate(
        { user: req.user._id, formula: formula._id },
        {
          user: req.user._id,
          formula: formula._id,
          nextReviewAt: new Date() // Due immediately
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    const progress = await FlashcardProgress.find({ user: req.user._id })
      .populate('formula');

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

### 5. Learning Path / Roadmap System

**Mục đích:** Lộ trình học tập dạng bản đồ zigzag

#### Models:

```javascript
// models/LearningPath.js
const learningPathSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  subject: { type: String, required: true },
  grade: { type: String, required: true }, // '10', '11', '12'
  nodes: [{
    id: String,
    type: { type: String, enum: ['lesson', 'quiz', 'boss', 'challenge'] },
    title: String,
    description: String,
    position: {
      x: Number,
      y: Number
    },
    requirements: [String], // node IDs
    content: {
      lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
      examId: { type: Schema.Types.ObjectId, ref: 'Exam' },
      videoUrl: String
    },
    rewards: {
      xp: Number,
      achievements: [String]
    }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// models/UserLearningProgress.js
const userLearningProgressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  learningPath: { type: Schema.Types.ObjectId, ref: 'LearningPath', required: true },
  completedNodes: [String], // node IDs
  currentNode: String,
  lastAccessedAt: { type: Date, default: Date.now },
  totalXP: { type: Number, default: 0 }
});

userLearningProgressSchema.index({ user: 1, learningPath: 1 }, { unique: true });
```

#### Endpoints:

**5.1. GET /api/learning-paths**

```javascript
/**
 * Lấy danh sách learning paths
 * Query: ?subject=Toán&grade=12
 */

router.get('/', auth, async (req, res) => {
  try {
    const { subject, grade } = req.query;
    
    const query = { isActive: true };
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;

    const paths = await LearningPath.find(query);

    // Add progress info
    const pathsWithProgress = await Promise.all(
      paths.map(async (path) => {
        const progress = await UserLearningProgress.findOne({
          user: req.user._id,
          learningPath: path._id
        });

        const totalNodes = path.nodes.length;
        const completedNodes = progress ? progress.completedNodes.length : 0;

        return {
          ...path.toObject(),
          totalNodes,
          completedNodes,
          progress: totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0
        };
      })
    );

    res.json({ success: true, data: pathsWithProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**5.2. GET /api/learning-paths/:id**

```javascript
/**
 * Chi tiết 1 learning path
 */

router.get('/:id', auth, async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      return res.status(404).json({
        success: false,
        message: 'Learning path không tồn tại'
      });
    }

    const progress = await UserLearningProgress.findOne({
      user: req.user._id,
      learningPath: path._id
    });

    const completedNodes = progress ? progress.completedNodes : [];

    // Add status to each node
    const nodesWithStatus = path.nodes.map(node => {
      let status = 'locked';
      
      if (completedNodes.includes(node.id)) {
        status = 'completed';
      } else {
        // Check if unlocked (all requirements met)
        const requirementsMet = node.requirements.every(reqId =>
          completedNodes.includes(reqId)
        );
        
        if (node.requirements.length === 0 || requirementsMet) {
          status = 'unlocked';
        }
      }

      return {
        ...node.toObject(),
        status,
        completedAt: status === 'completed' ? progress.lastAccessedAt : null
      };
    });

    res.json({
      success: true,
      data: {
        ...path.toObject(),
        nodes: nodesWithStatus,
        totalNodes: path.nodes.length,
        completedNodes: completedNodes.length,
        progress: Math.round((completedNodes.length / path.nodes.length) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**5.3. GET /api/learning-paths/me/progress**

```javascript
/**
 * Lấy progress của user
 * Query: ?pathId=xxx
 */

router.get('/me/progress', auth, async (req, res) => {
  try {
    const { pathId } = req.query;

    const query = { user: req.user._id };
    if (pathId) query.learningPath = pathId;

    const progress = await UserLearningProgress.findOne(query)
      .populate('learningPath');

    if (!progress) {
      return res.json({
        success: true,
        data: {
          completedNodes: [],
          currentNode: null,
          lastAccessedAt: null,
          totalXP: 0
        }
      });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**5.4. POST /api/learning-paths/:id/nodes/:nodeId/complete**

```javascript
/**
 * Hoàn thành 1 node
 */

router.post('/:id/nodes/:nodeId/complete', auth, async (req, res) => {
  try {
    const { id: pathId, nodeId } = req.params;

    const path = await LearningPath.findById(pathId);
    if (!path) {
      return res.status(404).json({
        success: false,
        message: 'Learning path không tồn tại'
      });
    }

    const node = path.nodes.find(n => n.id === nodeId);
    if (!node) {
      return res.status(404).json({
        success: false,
        message: 'Node không tồn tại'
      });
    }

    let progress = await UserLearningProgress.findOne({
      user: req.user._id,
      learningPath: pathId
    });

    if (!progress) {
      progress = await UserLearningProgress.create({
        user: req.user._id,
        learningPath: pathId,
        completedNodes: [],
        totalXP: 0
      });
    }

    // Check if already completed
    if (progress.completedNodes.includes(nodeId)) {
      return res.status(400).json({
        success: false,
        message: 'Node đã được hoàn thành rồi'
      });
    }

    // Add to completed
    progress.completedNodes.push(nodeId);
    progress.currentNode = nodeId;
    progress.lastAccessedAt = new Date();
    progress.totalXP += node.rewards.xp || 0;

    await progress.save();

    // Award XP
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: node.rewards.xp || 0 }
    });

    // Find newly unlocked nodes
    const unlockedNodes = path.nodes
      .filter(n => {
        if (progress.completedNodes.includes(n.id)) return false;
        
        const requirementsMet = n.requirements.every(reqId =>
          progress.completedNodes.includes(reqId)
        );
        
        return requirementsMet;
      })
      .map(n => n.id);

    res.json({
      success: true,
      data: {
        progress,
        xpEarned: node.rewards.xp || 0,
        unlockedNodes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**5.5. GET /api/learning-paths/:id/next-suggested**

```javascript
/**
 * Gợi ý node tiếp theo
 */

router.get('/:id/next-suggested', auth, async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id);
    if (!path) {
      return res.status(404).json({
        success: false,
        message: 'Learning path không tồn tại'
      });
    }

    const progress = await UserLearningProgress.findOne({
      user: req.user._id,
      learningPath: path._id
    });

    const completedNodes = progress ? progress.completedNodes : [];

    // Find first unlocked node that's not completed
    const suggestedNode = path.nodes.find(node => {
      if (completedNodes.includes(node.id)) return false;
      
      const requirementsMet = node.requirements.every(reqId =>
        completedNodes.includes(reqId)
      );
      
      return node.requirements.length === 0 || requirementsMet;
    });

    res.json({
      success: true,
      data: suggestedNode || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

## 🟢 MEDIUM PRIORITY (Week 5)

### 6. AI Teacher (Mock/Rule-based OK)

**6.1. GET /api/ai-teacher/suggestions**

```javascript
/**
 * AI suggestions (rule-based, không cần real AI)
 * Phân tích weak areas, recent attempts, roadmap progress
 */

router.get('/suggestions', auth, async (req, res) => {
  try {
    const suggestions = [];

    // 1. Check recent exam attempts for errors
    const recentAttempts = await ExamAttempt.find({ user: req.user._id })
      .populate({ path: 'exam', populate: 'questions' })
      .sort({ completedAt: -1 })
      .limit(3);

    // Analyze errors
    const errorTopics = {};
    recentAttempts.forEach(attempt => {
      attempt.exam.questions.forEach((question, idx) => {
        const userAnswer = attempt.answers[idx];
        const isCorrect = userAnswer?.answer === question.correctAnswer;
        
        if (!isCorrect) {
          errorTopics[question.topic] = (errorTopics[question.topic] || 0) + 1;
        }
      });
    });

    // Suggest fixing errors
    Object.entries(errorTopics).forEach(([topic, count]) => {
      if (count >= 2) {
        suggestions.push({
          id: `error-${topic}`,
          type: 'error-fix',
          topic,
          message: `Bạn đã sai ${count} câu về ${topic}. Hãy ôn lại nhé!`,
          priority: 'high',
          icon: '🎯',
          color: '#ef4444',
          metadata: {
            incorrectCount: count,
            totalCount: count
          }
        });
      }
    });

    // 2. Check roadmap progress
    const roadmapProgress = await UserLearningProgress.findOne({
      user: req.user._id
    }).populate('learningPath');

    if (roadmapProgress) {
      const completion = roadmapProgress.completedNodes.length / 
        roadmapProgress.learningPath.nodes.length;
      
      if (completion < 0.5) {
        suggestions.push({
          id: 'roadmap-progress',
          type: 'progress',
          topic: 'Lộ Trình',
          message: `Bạn đã hoàn thành ${Math.round(completion * 100)}% lộ trình. Tiếp tục phát huy!`,
          priority: 'medium',
          icon: '🗺️',
          color: '#10b981',
          metadata: {
            progress: Math.round(completion * 100)
          }
        });
      }
    }

    // 3. Check streak
    const user = await User.findById(req.user._id);
    if (user.streak.currentStreak === 0) {
      suggestions.push({
        id: 'start-streak',
        type: 'streak',
        topic: 'Streak',
        message: 'Hãy bắt đầu streak học tập của bạn ngay hôm nay!',
        priority: 'high',
        icon: '🔥',
        color: '#f97316'
      });
    }

    // 4. Suggest new topics
    const weakTopics = await getWeakTopics(req.user._id);
    if (weakTopics.length === 0) {
      suggestions.push({
        id: 'new-topic',
        type: 'new-topic',
        topic: 'Khám Phá Mới',
        message: 'Bạn đang làm rất tốt! Hãy thử topic mới nhé.',
        priority: 'low',
        icon: '✨',
        color: '#8b5cf6'
      });
    }

    res.json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

async function getWeakTopics(userId) {
  // Reuse from analytics endpoint
  // ... implementation
  return [];
}
```

**6.2. POST /api/ai-teacher/practice**

```javascript
/**
 * Generate practice questions (mock AI)
 * Body: { topic: string, difficulty: string, count: number }
 */

router.post('/practice', auth, async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    // Find random questions matching criteria
    const questions = await Question.aggregate([
      {
        $match: {
          topic,
          difficulty,
          isActive: true
        }
      },
      { $sample: { size: count } }
    ]);

    const estimatedTime = count * 60; // 1 minute per question

    res.json({
      success: true,
      data: {
        questions,
        estimatedTime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

## 🔧 CẢI THIỆN APIS CÓ SẴN

### Streak System Enhancements

**GET /api/users/me/streak/stats** (Thêm vào user routes)

```javascript
router.get('/me/streak/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const stats = {
      currentStreak: user.streak.currentStreak,
      longestStreak: user.streak.longestStreak,
      totalCheckIns: user.streak.totalCheckIns || 0,
      streakProtections: user.streakProtections || 0,
      nextMilestone: calculateNextMilestone(user.streak.currentStreak),
      lastCheckIn: user.streak.lastCheckIn
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

function calculateNextMilestone(currentStreak) {
  const milestones = [7, 14, 30, 50, 100];
  return milestones.find(m => m > currentStreak) || currentStreak + 10;
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Critical APIs (Week 1-2)
- [ ] Create DailyChallenge model
- [ ] Create ChallengeAttempt model  
- [ ] Implement 5 Challenge endpoints
- [ ] Implement 2 ExamAttempt analysis endpoints
- [ ] Implement 5 Analytics endpoints

### Phase 2: High Priority (Week 3-4)
- [ ] Create FlashcardProgress model
- [ ] Implement 5 Flashcard endpoints
- [ ] Create LearningPath model
- [ ] Create UserLearningProgress model
- [ ] Implement 5 Roadmap endpoints

### Phase 3: Medium Priority (Week 5)
- [ ] Implement 2 AI Teacher endpoints (mock)
- [ ] Add Streak stats endpoint
- [ ] Test all integrations

---

## 🧪 TESTING GUIDE

### Test Authentication First
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Save token to use in other requests
```

### Test Each Endpoint
```bash
# Example: Get daily challenge
curl http://localhost:5000/api/challenges/daily \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Integration Test
1. Start Backend: `npm run dev` (port 5000)
2. Start Frontend: `npm run dev` (port 3000)
3. Login via Frontend
4. Check browser Network tab for API calls
5. Verify responses match expected format

---

## 📝 RESPONSE FORMAT STANDARD

Tất cả APIs phải tuân theo format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... } // optional validation errors
}
```

---

## 🔐 SECURITY CHECKLIST

- [ ] All routes use `auth` middleware
- [ ] Validate user owns resources (check `user: req.user._id`)
- [ ] Sanitize inputs to prevent injection
- [ ] Rate limit sensitive endpoints
- [ ] Don't return `correctAnswer` until after submission
- [ ] Hash sensitive data in logs

---

## 🚀 DEPLOYMENT NOTES

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
PORT=5000
CORS_ORIGIN=https://quizme.vn
```

### Database Indexes
```javascript
// Add these indexes for performance
db.dailyChallenges.createIndex({ date: -1 });
db.challengeAttempts.createIndex({ user: 1, completedAt: -1 });
db.flashcardProgress.createIndex({ user: 1, nextReviewAt: 1 });
db.userLearningProgress.createIndex({ user: 1, learningPath: 1 }, { unique: true });
```

---

## 📞 SUPPORT

Nếu gặp vấn đề khi implement:

1. **Check Frontend Service Layer:** `/services/` để xem expected response format
2. **Check API Integration Doc:** `/API_INTEGRATION_COMPLETE.md`
3. **Test với Postman/curl** trước khi test với Frontend
4. **Console.log** responses để debug

---

**TÓM TẮT:**

Frontend đã SẴN SÀNG 100% và đang chờ Backend hoàn thiện:

🔴 **CRITICAL (Week 1-2):**
- Challenge 5 Phút (5 endpoints)
- ExamAttempt Analysis (2 endpoints)
- Analytics (5 endpoints)

🟡 **HIGH (Week 3-4):**
- Flashcards (5 endpoints)
- Learning Roadmap (5 endpoints)

🟢 **MEDIUM (Week 5):**
- AI Teacher (2 endpoints - mock OK)
- Streak enhancements (1 endpoint)

**Total:** ~25 endpoints cần implement/cải thiện

Sau khi hoàn thành, Frontend sẽ tự động kết nối và loại bỏ toàn bộ mock data! 🎉
