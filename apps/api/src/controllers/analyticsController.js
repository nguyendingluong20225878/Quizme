const ExamAttempt = require('../models/ExamAttempt');
const Question = require('../models/Question');
const Topic = require('../models/Topic');
const XPHistory = require('../models/XPHistory');
const User = require('../models/User');

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

// @desc    Lấy dữ liệu phân tích tổng quan
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Spider chart data (by subject)
    const spiderChart = await getSpiderChartData(userId);

    // Progress trend
    const progressTrend = await getProgressTrendData(userId, 'week');

    // Error by difficulty
    const errorByDifficulty = await getErrorByDifficultyData(userId);

    // Error by type
    const errorByType = await getErrorByTypeData(userId);

    // Weak topics
    const weakTopics = await getWeakTopicsData(userId);

    res.status(200).json({
      success: true,
      spiderChart,
      progressTrend,
      errorByDifficulty,
      errorByType,
      weakTopics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Phân tích theo môn học
// @route   GET /api/analytics/subjects/:subject
// @access  Private
exports.getSubjectAnalysis = async (req, res, next) => {
  try {
    const { subject } = req.params;
    const userId = req.user.id;

    const Subject = require('../models/Subject');
    const subjectDoc = await Subject.findOne({ name: subject });

    if (!subjectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy môn học',
      });
    }

    const attempts = await ExamAttempt.find({
      user: userId,
    }).populate({
      path: 'exam',
      match: { subject: subjectDoc._id },
      populate: { path: 'questions' },
    });

    const validAttempts = attempts.filter(a => a.exam);

    // Overall score
    const totalScore = validAttempts.reduce((sum, a) => sum + (a.score || 0), 0);
    const overallScore = validAttempts.length > 0 
      ? Math.round(totalScore / validAttempts.length) 
      : 0;

    // Topic breakdown
    const topicBreakdown = await getTopicBreakdown(userId, subjectDoc._id);

    // Strengths and weaknesses
    const strengthsWeaknesses = await getStrengthsWeaknesses(userId, subjectDoc._id);

    // Recommendations
    const recommendations = generateRecommendations(overallScore, strengthsWeaknesses);

    res.status(200).json({
      success: true,
      subject: subjectDoc.name,
      overallScore,
      topicBreakdown,
      strengthsWeaknesses,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Phân tích tiến độ theo thời gian
// @route   GET /api/analytics/progress
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query;
    const userId = req.user.id;

    const data = await getProgressTrendData(userId, period);
    
    // Summary
    const startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const xpHistory = await XPHistory.find({
      user: userId,
      createdAt: { $gte: startDate },
    });

    const attempts = await ExamAttempt.find({
      user: userId,
      submittedAt: { $gte: startDate },
    });

    const totalXP = xpHistory.reduce((sum, h) => sum + (h.amount || 0), 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + (a.totalQuestions || 0), 0);
    const totalCorrect = attempts.reduce((sum, a) => sum + (a.correctAnswers || 0), 0);
    const averageAccuracy = totalQuestions > 0 
      ? Math.round((totalCorrect / totalQuestions) * 100) 
      : 0;

    // Calculate improvement rate
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, d) => sum + d.accuracy, 0) / firstHalf.length 
      : 0;
    const secondAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, d) => sum + d.accuracy, 0) / secondHalf.length 
      : 0;
    const improvementRate = firstAvg > 0 
      ? Math.round(((secondAvg - firstAvg) / firstAvg) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: data.map(d => ({
        date: d.date,
        xp: d.xp || 0,
        accuracy: d.accuracy || 0,
        questionsCompleted: d.questionsCompleted || 0,
      })),
      summary: {
        totalXP,
        averageAccuracy,
        totalQuestions,
        improvementRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
async function getSpiderChartData(userId) {
  const attempts = await ExamAttempt.find({ user: userId }).populate('exam');
  const subjectStats = {};

  attempts.forEach(attempt => {
    if (!attempt.exam || !attempt.exam.subject) return;
    const subjectName = attempt.exam.subject.name || attempt.exam.subject.toString();
    
    if (!subjectStats[subjectName]) {
      subjectStats[subjectName] = { totalScore: 0, count: 0 };
    }
    subjectStats[subjectName].totalScore += attempt.score || 0;
    subjectStats[subjectName].count += 1;
  });

  return Object.entries(subjectStats).map(([subject, stats]) => ({
    subject,
    score: stats.count > 0 ? Math.round(stats.totalScore / stats.count) : 0,
  }));
}

async function getProgressTrendData(userId, period) {
  const days = period === 'month' ? 30 : period === 'year' ? 365 : 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const attempts = await ExamAttempt.find({
    user: userId,
    submittedAt: { $gte: startDate },
  }).sort({ submittedAt: 1 });

  const xpHistory = await XPHistory.find({
    user: userId,
    createdAt: { $gte: startDate },
  });

  const trendMap = {};

  attempts.forEach(attempt => {
    const date = (attempt.submittedAt || attempt.createdAt).toISOString().split('T')[0];
    if (!trendMap[date]) {
      trendMap[date] = { score: 0, count: 0, questions: 0, correct: 0 };
    }
    trendMap[date].score += attempt.score || 0;
    trendMap[date].count += 1;
    trendMap[date].questions += attempt.totalQuestions || 0;
    trendMap[date].correct += attempt.correctAnswers || 0;
  });

  xpHistory.forEach(history => {
    const date = history.createdAt.toISOString().split('T')[0];
    if (!trendMap[date]) {
      trendMap[date] = { score: 0, count: 0, questions: 0, correct: 0, xp: 0 };
    }
    trendMap[date].xp = (trendMap[date].xp || 0) + (history.amount || 0);
  });

  return Object.entries(trendMap).map(([date, stats]) => ({
    date,
    score: stats.count > 0 ? Math.round(stats.score / stats.count) : 0,
    xp: stats.xp || 0,
    accuracy: stats.questions > 0 ? Math.round((stats.correct / stats.questions) * 100) : 0,
    questionsCompleted: stats.questions,
  }));
}

async function getErrorByDifficultyData(userId) {
  const attempts = await ExamAttempt.find({ user: userId }).populate({
    path: 'exam',
    populate: { path: 'questions' },
  });

  const difficultyStats = {
    easy: { correct: 0, incorrect: 0, total: 0 },
    medium: { correct: 0, incorrect: 0, total: 0 },
    hard: { correct: 0, incorrect: 0, total: 0 },
  };

  attempts.forEach(attempt => {
    const questions = attempt.exam?.questions || [];
    questions.forEach(question => {
      const qId = question._id.toString();
      const userAnswer = attempt.answers?.get?.(qId);
      const isCorrect = userAnswer != null && String(userAnswer) === String(question.correctAnswer);

      let difficulty = 'medium';
      if (question.difficulty) {
        const d = question.difficulty.toLowerCase();
        if (d.includes('easy') || d.includes('cơ bản') || d.includes('nhận biết')) difficulty = 'easy';
        else if (d.includes('hard') || d.includes('nâng cao') || d.includes('vận dụng cao')) difficulty = 'hard';
      }

      if (difficultyStats[difficulty]) {
        difficultyStats[difficulty].total += 1;
        if (isCorrect) difficultyStats[difficulty].correct += 1;
        else difficultyStats[difficulty].incorrect += 1;
      }
    });
  });

  return Object.entries(difficultyStats).map(([difficulty, stats]) => ({
    difficulty,
    correct: stats.correct,
    incorrect: stats.incorrect,
    total: stats.total,
    percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));
}

async function getErrorByTypeData(userId) {
  // Similar to getErrorByDifficulty but for question types
  return [];
}

async function getWeakTopicsData(userId) {
  const attempts = await ExamAttempt.find({ user: userId }).populate({
    path: 'exam',
    populate: { path: 'questions' },
  });

  const topicStats = {};

  attempts.forEach(attempt => {
    const questions = attempt.exam?.questions || [];
    questions.forEach(question => {
      const qId = question._id.toString();
      const userAnswer = attempt.answers?.get?.(qId);
      const isCorrect = userAnswer != null && String(userAnswer) === String(question.correctAnswer);

      const topicName = (question.topic && (question.topic.name || question.topic.toString())) || 'Khác';

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

  return Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      trend: 'stable',
      wrongQuestions: stats.wrong,
      totalQuestions: stats.total,
      commonErrors: stats.commonErrors.slice(0, 3),
    }))
    .filter(t => t.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
}

async function getTopicBreakdown(userId, subjectId) {
  // Implementation for topic breakdown
  return [];
}

async function getStrengthsWeaknesses(userId, subjectId) {
  // Implementation for strengths/weaknesses
  return { strengths: [], weaknesses: [] };
}

function generateRecommendations(score, strengthsWeaknesses) {
  const recommendations = [];
  if (score < 60) {
    recommendations.push('Bạn cần ôn tập thêm các kiến thức cơ bản');
  }
  if (strengthsWeaknesses.weaknesses.length > 0) {
    recommendations.push(`Tập trung vào các chủ đề: ${strengthsWeaknesses.weaknesses.join(', ')}`);
  }
  return recommendations;
}

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


