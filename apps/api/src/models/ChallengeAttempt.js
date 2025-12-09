const mongoose = require('mongoose');

const ChallengeAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyChallenge',
      required: true,
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        answer: Number,
        timeSpent: Number,
      },
    ],
    score: { type: Number, required: true, default: 0 },
    totalQuestions: { type: Number, default: 5 },
    correctAnswers: { type: Number, required: true, default: 0 },
    timeSpent: { type: Number, required: true, default: 0 },
    completedAt: { type: Date, default: null },
    xpEarned: { type: Number, default: 0 },
    isDaily: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

ChallengeAttemptSchema.index({ user: 1, completedAt: -1 });
ChallengeAttemptSchema.index({ user: 1, challenge: 1 }, { unique: true });

module.exports = mongoose.model('ChallengeAttempt', ChallengeAttemptSchema);


