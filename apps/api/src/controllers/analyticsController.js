const ExamAttempt = require('../models/ExamAttempt');

// GET /api/analytics/competency-radar
exports.getCompetencyRadar = async (req, res, next) => {
  try {
    const attempts = await ExamAttempt.find({ user: req.user.id }).populate('exam');

    const subjectStats = {};

    attempts.forEach((attempt) => {
      if (!attempt.exam || !attempt.exam.subject) return;
      const subject = attempt.exam.subject;

      if (!subjectStats[subject]) {
        subjectStats[subject] = { totalScore: 0, count: 0 };
      }

      subjectStats[subject].totalScore += attempt.score || 0;
      subjectStats[subject].count += 1;
    });

    const data = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      score: stats.count > 0 ? Math.round(stats.totalScore / stats.count) : 0,
      fullMark: 100,
      attempts: stats.count,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/error-analysis/by-difficulty
exports.getErrorByDifficulty = async (req, res, next) => {
  try {
    const attempts = await ExamAttempt.find({ user: req.user.id }).populate({
      path: 'exam',
      populate: { path: 'questions' },
    });

    const difficultyStats = {
      easy: { correct: 0, incorrect: 0, total: 0 },
      medium: { correct: 0, incorrect: 0, total: 0 },
      hard: { correct: 0, incorrect: 0, total: 0 },
    };

    attempts.forEach((attempt) => {
      const questions = attempt.exam?.questions || [];
      questions.forEach((question) => {
        const qId = question._id.toString();
        const userAnswer = attempt.answers.get(qId);
        const isCorrect =
          userAnswer != null && String(userAnswer) === String(question.correctAnswer);

        let difficulty = 'medium';
        if (question.difficulty) {
          const d = question.difficulty.toLowerCase();
          if (d.includes('easy') || d.includes('cơ bản')) difficulty = 'easy';
          else if (d.includes('hard') || d.includes('nâng cao')) difficulty = 'hard';
        }

        if (difficultyStats[difficulty]) {
          difficultyStats[difficulty].total += 1;
          if (isCorrect) difficultyStats[difficulty].correct += 1;
          else difficultyStats[difficulty].incorrect += 1;
        }
      });
    });

    const data = Object.entries(difficultyStats).map(([difficulty, stats]) => ({
      difficulty,
      correct: stats.correct,
      incorrect: stats.incorrect,
      total: stats.total,
      percentage:
        stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      color:
        difficulty === 'easy'
          ? '#10b981'
          : difficulty === 'medium'
          ? '#f59e0b'
          : '#ef4444',
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/error-analysis/by-type
exports.getErrorByType = async (req, res, next) => {
  try {
    const attempts = await ExamAttempt.find({ user: req.user.id }).populate({
      path: 'exam',
      populate: { path: 'questions' },
    });

    const typeStats = {
      recognition: { correct: 0, incorrect: 0, total: 0 },
      comprehension: { correct: 0, incorrect: 0, total: 0 },
      application: { correct: 0, incorrect: 0, total: 0 },
      analysis: { correct: 0, incorrect: 0, total: 0 },
    };

    const typeIcons = {
      recognition: '🎯',
      comprehension: '🧠',
      application: '⚡',
      analysis: '🔬',
    };

    const typeColors = {
      recognition: '#06b6d4',
      comprehension: '#8b5cf6',
      application: '#ec4899',
      analysis: '#f97316',
    };

    attempts.forEach((attempt) => {
      const questions = attempt.exam?.questions || [];
      questions.forEach((question) => {
        const qId = question._id.toString();
        const userAnswer = attempt.answers.get(qId);
        const isCorrect =
          userAnswer != null && String(userAnswer) === String(question.correctAnswer);
        const type = question.questionType || 'recognition';

        if (typeStats[type]) {
          typeStats[type].total += 1;
          if (isCorrect) typeStats[type].correct += 1;
          else typeStats[type].incorrect += 1;
        }
      });
    });

    const data = Object.entries(typeStats).map(([type, stats]) => ({
      type,
      correct: stats.correct,
      incorrect: stats.incorrect,
      total: stats.total,
      percentage:
        stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      icon: typeIcons[type],
      color: typeColors[type],
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/progress-trend
exports.getProgressTrend = async (req, res, next) => {
  try {
    const period = req.query.period || 'week';
    const days = period === 'month' ? 30 : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const attempts = await ExamAttempt.find({
      user: req.user.id,
      submittedAt: { $gte: startDate },
    }).sort({ submittedAt: 1 });

    const trendMap = {};

    attempts.forEach((attempt) => {
      const date = (attempt.submittedAt || attempt.createdAt)
        .toISOString()
        .split('T')[0];
      if (!trendMap[date]) {
        trendMap[date] = { totalScore: 0, count: 0 };
      }
      trendMap[date].totalScore += attempt.score || 0;
      trendMap[date].count += 1;
    });

    const data = Object.entries(trendMap).map(([date, stats]) => ({
      date,
      score: stats.count > 0 ? Math.round(stats.totalScore / stats.count) : 0,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/weak-topics
exports.getWeakTopics = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;

    const attempts = await ExamAttempt.find({ user: req.user.id }).populate({
      path: 'exam',
      populate: { path: 'questions' },
    });

    const topicStats = {};

    attempts.forEach((attempt) => {
      const questions = attempt.exam?.questions || [];
      questions.forEach((question) => {
        const qId = question._id.toString();
        const userAnswer = attempt.answers.get(qId);
        const isCorrect =
          userAnswer != null && String(userAnswer) === String(question.correctAnswer);

        const topicName =
          (question.topic && (question.topic.name || question.topic.toString())) ||
          'Khác';

        if (!topicStats[topicName]) {
          topicStats[topicName] = {
            correct: 0,
            wrong: 0,
            total: 0,
            commonErrors: [],
          };
        }

        topicStats[topicName].total += 1;
        if (isCorrect) {
          topicStats[topicName].correct += 1;
        } else {
          topicStats[topicName].wrong += 1;
          topicStats[topicName].commonErrors.push(question.text || question.question);
        }
      });
    });

    const weakTopics = Object.entries(topicStats)
      .map(([topic, stats]) => ({
        id: topic.toLowerCase().replace(/\s+/g, '-'),
        topic,
        score:
          stats.total > 0
            ? Math.round((stats.correct / stats.total) * 100)
            : 0,
        trend: 'stable',
        wrongQuestions: stats.wrong,
        totalQuestions: stats.total,
        commonErrors: stats.commonErrors.slice(0, 3),
        icon: '📚',
      }))
      .filter((t) => t.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, limit);

    res.status(200).json({ success: true, data: weakTopics });
  } catch (error) {
    next(error);
  }
};


