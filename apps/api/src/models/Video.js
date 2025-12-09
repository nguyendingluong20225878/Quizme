/**
 * Video Model
 * Schema cho video bài giảng
 */

const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề video'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Vui lòng nhập URL video'],
    },
    duration: {
      type: String, // Format: "4:32"
      default: null,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Video', VideoSchema);

