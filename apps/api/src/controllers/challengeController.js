const DailyChallenge = require('../models/DailyChallenge');
const ChallengeAttempt = require('../models/ChallengeAttempt');
const Question = require('../models/Question');
const User = require('../models/User');
const XPHistory = require('../models/XPHistory');

// GET /api/challenges/daily
exports.getDailyChallenge = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let challenge = await DailyChallenge.findOne({ date: today }).populate(
      'questions',
      '-correctAnswer -explanation'
    );

    if (!challenge) {
      const questions = await Question.aggregate([
        { $match: { isActive: true, type: 'multiple-choice' } },
        { $sample: { size: 5 } },
      ]);

      challenge = await DailyChallenge.create({
        date: today,
        questions: questions.map((q) => q._id),
        timeLimit: 300,
        xpReward: 50,
      });

      challenge = await challenge.populate('questions', '-correctAnswer -explanation');
    }

    const attempt = await ChallengeAttempt.findOne({
      user: req.user.id,
      challenge: challenge._id,
    });

    res.status(200).json({
      success: true,
      data: {
        id: challenge._id,
        date: challenge.date,
        questions: challenge.questions.map((q) => ({
          id: q._id,
          question: q.text,
          options: q.options,
          difficulty: q.difficulty,
          topic: q.topic,
        })),
        timeLimit: challenge.timeLimit,
        xpReward: challenge.xpReward,
        completed: !!attempt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/challenges/start
exports.startChallenge = async (req, res, next) => {
  try {
    const { challengeId } = req.body;

    const existing = await ChallengeAttempt.findOne({
      user: req.user.id,
      challenge: challengeId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã hoàn thành challenge này rồi',
      });
    }

    const challenge = await DailyChallenge.findById(challengeId).populate(
      'questions',
      '-correctAnswer -explanation'
    );

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge không tồn tại',
      });
    }

    const attempt = await ChallengeAttempt.create({
      user: req.user.id,
      challenge: challengeId,
      answers: [],
      score: 0,
      correctAnswers: 0,
      timeSpent: 0,
      totalQuestions: challenge.questions.length,
    });

    res.status(200).json({
      success: true,
      data: {
        attempt,
        challenge: {
          id: challenge._id,
          date: challenge.date,
          questions: challenge.questions.map((q) => ({
            id: q._id,
            question: q.text,
            options: q.options,
            difficulty: q.difficulty,
            topic: q.topic,
          })),
          timeLimit: challenge.timeLimit,
          xpReward: challenge.xpReward,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/challenges/:id/submit
exports.submitChallenge = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const challengeId = req.params.id;

    const challenge = await DailyChallenge.findById(challengeId).populate('questions');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge không tồn tại',
      });
    }

    const questions = challenge.questions;
    let correctAnswers = 0;
    let totalTimeSpent = 0;
    const results = [];

    answers.forEach((ans) => {
      const question = questions.find((q) => q._id.toString() === ans.questionId);
      if (!question) return;

      const isCorrect =
        String(question.correctAnswer) === String(ans.answer);
      if (isCorrect) correctAnswers += 1;
      totalTimeSpent += ans.timeSpent || 0;

      results.push({
        questionId: ans.questionId,
        correct: isCorrect,
        userAnswer: ans.answer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      });
    });

    const score =
      questions.length > 0
        ? Math.round((correctAnswers / questions.length) * 100)
        : 0;

    const attempt = await ChallengeAttempt.findOneAndUpdate(
      { user: req.user.id, challenge: challengeId },
      {
        answers,
        score,
        correctAnswers,
        timeSpent: totalTimeSpent,
        completedAt: new Date(),
        xpEarned: challenge.xpReward,
      },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { xp: challenge.xpReward },
    });

    await XPHistory.create({
      user: req.user.id,
      amount: challenge.xpReward,
      source: 'challenge',
      description: 'Hoàn thành Challenge 5 Phút',
    });

    const newStreak = await calculateChallengeStreak(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        attempt,
        score,
        xpEarned: challenge.xpReward,
        newStreak,
        results,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/challenges/history
exports.getChallengeHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const attempts = await ChallengeAttempt.find({ user: req.user.id })
      .populate('challenge')
      .sort({ completedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/challenges/streak
exports.getChallengeStreak = async (req, res, next) => {
  try {
    const attempts = await ChallengeAttempt.find({ user: req.user.id })
      .populate('challenge')
      .sort({ completedAt: -1 });

    const currentStreak = await calculateChallengeStreak(req.user.id);

    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    attempts.forEach((attempt) => {
      if (!attempt.challenge || !attempt.challenge.date) return;
      const attemptDate = new Date(attempt.challenge.date);
      attemptDate.setHours(0, 0, 0, 0);

      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.floor(
          (prevDate - attemptDate) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          tempStreak += 1;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      prevDate = attemptDate;
    });

    longestStreak = Math.max(longestStreak, tempStreak);

    res.status(200).json({
      success: true,
      data: {
        currentStreak,
        longestStreak,
        totalCompleted: attempts.length,
        lastCompletedDate:
          attempts.length > 0 ? attempts[0].completedAt : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

async function calculateChallengeStreak(userId) {
  const attempts = await ChallengeAttempt.find({ user: userId })
    .populate('challenge')
    .sort({ completedAt: -1 })
    .limit(100);

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const attempt of attempts) {
    if (!attempt.challenge || !attempt.challenge.date) continue;
    const attemptDate = new Date(attempt.challenge.date);
    attemptDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate - attemptDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}


