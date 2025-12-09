/**
 * Question Controller
 * Xử lý CRUD operations cho Question
 */

const Question = require('../models/Question');

// @desc    Lấy danh sách tất cả questions
// @route   GET /api/questions
// @access  Public
exports.getQuestions = async (req, res, next) => {
  try {
    const { topic, subject, difficulty, type, includeAnswer } = req.query;

    const query = { isActive: true };

    if (topic) {
      query.topic = topic;
    }

    if (subject) {
      query.subject = subject;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (type) {
      query.type = type;
    }

    let selectFields = '-__v';
    if (includeAnswer !== 'true') {
      selectFields += ' -correctAnswer'; // Không trả về đáp án nếu không cần
    }

    const questions = await Question.find(query)
      .populate('topic', 'name')
      .populate('subject', 'name code')
      .select(selectFields)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin question theo ID
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestion = async (req, res, next) => {
  try {
    const { includeAnswer } = req.query;

    let question = await Question.findById(req.params.id)
      .populate('topic', 'name')
      .populate('subject', 'name code');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy câu hỏi',
      });
    }

    // Nếu không có quyền xem đáp án, loại bỏ correctAnswer
    if (includeAnswer !== 'true') {
      question = question.toObject();
      delete question.correctAnswer;
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo question mới
// @route   POST /api/questions
// @access  Private/Admin
exports.createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật question
// @route   PUT /api/questions/:id
// @access  Private/Admin
exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('topic subject');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy câu hỏi',
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy câu hỏi',
      });
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa câu hỏi thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật NHIỀU question với dữ liệu KHÁC NHAU
// @route   POST /api/questions/update-many
// @access  Private/Admin
exports.updateManyQuestions = async (req, res, next) => {
  try {
    const updates = req.body; // ✅ Nhận mảng như bạn gửi

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Body phải là một mảng các question cần update',
      });
    }

    const bulkOps = updates.map((item) => {
      if (!item.id) {
        throw new Error('Thiếu id trong danh sách update');
      }

      const updateData = { ...item };
      delete updateData.id;

      return {
        updateOne: {
          filter: { _id: item.id },
          update: { $set: updateData },
        },
      };
    });

    const result = await Question.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Cập nhật hàng loạt thành công',
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};
