/**
 * Formula Controller
 * Xử lý CRUD operations cho Formula
 */

const Formula = require('../models/Formula');

// @desc    Lấy danh sách tất cả formulas
// @route   GET /api/formulas
// @access  Public
exports.getFormulas = async (req, res, next) => {
  try {
    const { category, topic, subject, search } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (topic) {
      query.topic = topic;
    }

    if (subject) {
      query.subject = subject;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { formula: { $regex: search, $options: 'i' } },
      ];
    }

    const formulas = await Formula.find(query)
      .populate('topic', 'name')
      .populate('subject', 'name')
      .sort({ category: 1, title: 1 });

    res.status(200).json({
      success: true,
      count: formulas.length,
      data: formulas,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin formula theo ID
// @route   GET /api/formulas/:id
// @access  Public
exports.getFormula = async (req, res, next) => {
  try {
    const formula = await Formula.findById(req.params.id)
      .populate('topic', 'name')
      .populate('subject', 'name');

    if (!formula) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công thức',
      });
    }

    res.status(200).json({
      success: true,
      data: formula,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo formula mới
// @route   POST /api/formulas
// @access  Private/Admin
exports.createFormula = async (req, res, next) => {
  try {
    const formula = await Formula.create(req.body);

    res.status(201).json({
      success: true,
      data: formula,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật formula
// @route   PUT /api/formulas/:id
// @access  Private/Admin
exports.updateFormula = async (req, res, next) => {
  try {
    const formula = await Formula.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('topic subject');

    if (!formula) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công thức',
      });
    }

    res.status(200).json({
      success: true,
      data: formula,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa formula
// @route   DELETE /api/formulas/:id
// @access  Private/Admin
exports.deleteFormula = async (req, res, next) => {
  try {
    const formula = await Formula.findById(req.params.id);

    if (!formula) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công thức',
      });
    }

    await formula.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa công thức thành công',
    });
  } catch (error) {
    next(error);
  }
};

