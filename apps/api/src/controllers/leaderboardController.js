/**
 * Leaderboard Controller
 * Xử lý logic cho Leaderboard
 */

const User = require('../models/User');
const ExamAttempt = require('../models/ExamAttempt');

// Helper function để tính điểm leaderboard
function calculateLeaderboardScore(user) {
  // Điểm = XP * 0.1 + Level * 100 + Streak * 10
  const xp = user.xp || 0;
  const level = user.level || 1;
  const streak = user.streakDays || 0;
  
  return xp * 0.1 + level * 100 + streak * 10;
}

// @desc    Lấy leaderboard hàng tuần
// @route   GET /api/leaderboard/weekly
// @access  Public
exports.getWeeklyLeaderboard = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Tính ngày bắt đầu tuần (Thứ 2)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Chủ nhật = 0, thứ 2 = 1
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Lấy tất cả users và tính điểm tuần
    const users = await User.find().select('-password');
    
    // Tính điểm tuần cho mỗi user dựa trên exam attempts trong tuần
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const attempts = await ExamAttempt.find({
          user: user._id,
          submittedAt: { $gte: startOfWeek },
          status: 'submitted',
        });

        const weeklyScore = attempts.reduce((sum, attempt) => {
          return sum + (attempt.score || 0);
        }, 0);

        const correctAnswers = attempts.reduce((sum, attempt) => {
          return sum + (attempt.correctAnswers || 0);
        }, 0);

        return {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            level: user.level || 1,
            xp: user.xp || 0,
          },
          weeklyScore,
          correctAnswers,
          examsCompleted: attempts.length,
        };
      })
    );

    // Sắp xếp theo điểm tuần
    leaderboardData.sort((a, b) => b.weeklyScore - a.weeklyScore);

    // Pagination
    const total = leaderboardData.length;
    const paginatedData = leaderboardData.slice(skip, skip + limit);

    // Thêm rank
    const leaderboard = paginatedData.map((item, index) => ({
      rank: skip + index + 1,
      ...item,
    }));

    res.status(200).json({
      success: true,
      data: leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      period: {
        type: 'weekly',
        start: startOfWeek,
        end: now,
      },
      message: 'Lấy leaderboard tuần thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy leaderboard hàng tháng
// @route   GET /api/leaderboard/monthly
// @access  Public
exports.getMonthlyLeaderboard = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Tính ngày bắt đầu tháng
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Lấy tất cả users và tính điểm tháng
    const users = await User.find().select('-password');
    
    // Tính điểm tháng cho mỗi user dựa trên exam attempts trong tháng
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const attempts = await ExamAttempt.find({
          user: user._id,
          submittedAt: { $gte: startOfMonth },
          status: 'submitted',
        });

        const monthlyScore = attempts.reduce((sum, attempt) => {
          return sum + (attempt.score || 0);
        }, 0);

        const correctAnswers = attempts.reduce((sum, attempt) => {
          return sum + (attempt.correctAnswers || 0);
        }, 0);

        return {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            level: user.level || 1,
            xp: user.xp || 0,
          },
          monthlyScore,
          correctAnswers,
          examsCompleted: attempts.length,
        };
      })
    );

    // Sắp xếp theo điểm tháng
    leaderboardData.sort((a, b) => b.monthlyScore - a.monthlyScore);

    // Pagination
    const total = leaderboardData.length;
    const paginatedData = leaderboardData.slice(skip, skip + limit);

    // Thêm rank
    const leaderboard = paginatedData.map((item, index) => ({
      rank: skip + index + 1,
      ...item,
    }));

    res.status(200).json({
      success: true,
      data: leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      period: {
        type: 'monthly',
        start: startOfMonth,
        end: now,
      },
      message: 'Lấy leaderboard tháng thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy leaderboard all-time
// @route   GET /api/leaderboard/alltime
// @access  Public
exports.getAllTimeLeaderboard = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Lấy tất cả users và tính điểm all-time
    const users = await User.find().select('-password').sort({ xp: -1, level: -1 });
    
    // Tính điểm all-time cho mỗi user
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const attempts = await ExamAttempt.find({
          user: user._id,
          status: 'submitted',
        });

        const totalScore = attempts.reduce((sum, attempt) => {
          return sum + (attempt.score || 0);
        }, 0);

        const correctAnswers = attempts.reduce((sum, attempt) => {
          return sum + (attempt.correctAnswers || 0);
        }, 0);

        const leaderboardScore = calculateLeaderboardScore(user);

        return {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            level: user.level || 1,
            xp: user.xp || 0,
            streakDays: user.streakDays || 0,
          },
          leaderboardScore,
          totalScore,
          correctAnswers,
          examsCompleted: attempts.length,
        };
      })
    );

    // Sắp xếp theo leaderboard score
    leaderboardData.sort((a, b) => b.leaderboardScore - a.leaderboardScore);

    // Pagination
    const total = leaderboardData.length;
    const paginatedData = leaderboardData.slice(skip, skip + limit);

    // Thêm rank
    const leaderboard = paginatedData.map((item, index) => ({
      rank: skip + index + 1,
      ...item,
    }));

    res.status(200).json({
      success: true,
      data: leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      period: {
        type: 'alltime',
      },
      message: 'Lấy leaderboard all-time thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy leaderboard bạn bè
// @route   GET /api/leaderboard/friends
// @access  Private
exports.getFriendsLeaderboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // TODO: Implement friend system
    // Hiện tại, trả về leaderboard với user hiện tại và một số users khác
    // Trong tương lai, có thể thêm Friend model để quản lý bạn bè

    const currentUser = await User.findById(userId).select('-password');
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Lấy một số users khác (giả lập bạn bè)
    // Trong thực tế, sẽ query từ Friend model
    const otherUsers = await User.find({
      _id: { $ne: userId },
    })
      .select('-password')
      .limit(limit - 1)
      .sort({ xp: -1, level: -1 });

    const allUsers = [currentUser, ...otherUsers];

    // Tính điểm cho mỗi user
    const leaderboardData = await Promise.all(
      allUsers.map(async (user) => {
        const attempts = await ExamAttempt.find({
          user: user._id,
          status: 'submitted',
        });

        const totalScore = attempts.reduce((sum, attempt) => {
          return sum + (attempt.score || 0);
        }, 0);

        const leaderboardScore = calculateLeaderboardScore(user);
        const isCurrentUser = user._id.toString() === userId;

        return {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            level: user.level || 1,
            xp: user.xp || 0,
            streakDays: user.streakDays || 0,
          },
          leaderboardScore,
          totalScore,
          examsCompleted: attempts.length,
          isCurrentUser,
        };
      })
    );

    // Sắp xếp theo leaderboard score
    leaderboardData.sort((a, b) => b.leaderboardScore - a.leaderboardScore);

    // Pagination
    const total = leaderboardData.length;
    const paginatedData = leaderboardData.slice(skip, skip + limit);

    // Thêm rank
    const leaderboard = paginatedData.map((item, index) => ({
      rank: skip + index + 1,
      ...item,
    }));

    res.status(200).json({
      success: true,
      data: leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      period: {
        type: 'friends',
      },
      message: 'Lấy leaderboard bạn bè thành công',
    });
  } catch (error) {
    next(error);
  }
};

