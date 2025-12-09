/**
 * Question Model
 * Schema cho câu hỏi (trắc nghiệm, đúng/sai, tự luận)
 */

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'essay'],
      required: [true, 'Vui lòng chọn loại câu hỏi'],
    },
    text: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung câu hỏi'],
    },
    image: {
      type: String,
      default: null,
    },
    options: {
      type: [String],
      required: function () {
        return this.type === 'multiple-choice';
      },
    },
    correctAnswer: {
      type: String,
      required: function () {
        return this.type !== 'essay';
      },
    },
    explanation: {
      type: String,
      default: null,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'],
      default: 'Thông hiểu',
    },
    points: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', QuestionSchema);

