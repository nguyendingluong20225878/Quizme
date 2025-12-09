/**
 * Video Controller
 * Xử lý CRUD operations cho Video
 */

const Video = require('../models/Video');

// @desc    Lấy danh sách tất cả videos
// @route   GET /api/videos
// @access  Public
exports.getVideos = async (req, res, next) => {
  try {
    const { topic, subject, search } = req.query;

    const query = {};

    if (topic) {
      query.topic = topic;
    }

    if (subject) {
      query.subject = subject;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const videos = await Video.find(query)
      .populate('topic', 'name')
      .populate('subject', 'name')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin video theo ID
// @route   GET /api/videos/:id
// @access  Public
exports.getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('topic', 'name')
      .populate('subject', 'name');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy video',
      });
    }

    // Tăng lượt xem
    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo video mới
// @route   POST /api/videos
// @access  Private/Admin
exports.createVideo = async (req, res, next) => {
  try {
    const video = await Video.create(req.body);

    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật video
// @route   PUT /api/videos/:id
// @access  Private/Admin
exports.updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('topic subject');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy video',
      });
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy video',
      });
    }

    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa video thành công',
    });
  } catch (error) {
    next(error);
  }
};

