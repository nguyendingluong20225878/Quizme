/**
 * Streak Controller
 * Xử lý logic cho Study Streak
 */

const User = require('../models/User');

// Helper function để kiểm tra xem 2 ngày có liên tiếp không
function isConsecutiveDay(date1, date2) {
  const day1 = new Date(date1);
  day1.setHours(0, 0, 0, 0);
  
  const day2 = new Date(date2);
  day2.setHours(0, 0, 0, 0);

  const diffTime = day2 - day1;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays === 1;
}

// Helper function để kiểm tra xem có cùng ngày không
function isSameDay(date1, date2) {
  const day1 = new Date(date1);
  day1.setHours(0, 0, 0, 0);
  
  const day2 = new Date(date2);
  day2.setHours(0, 0, 0, 0);

  return day1.getTime() === day2.getTime();
}

// @desc    Lấy thông tin streak
// @route   GET /api/users/me/streak
// @access  Private
exports.getStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('streakDays lastActiveDate');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    const lastActiveDay = lastActive ? new Date(lastActive) : null;
    if (lastActiveDay) {
      lastActiveDay.setHours(0, 0, 0, 0);
    }

    const hasCheckedInToday = lastActiveDay && isSameDay(today, lastActiveDay);

    let currentStreak = user.streakDays || 0;
    if (lastActiveDay) {
      const daysDiff = (today - lastActiveDay) / (1000 * 60 * 60 * 24);
      if (daysDiff > 1) {
        currentStreak = 0;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        currentStreak,
        longestStreak: currentStreak,
        lastCheckIn: user.lastActiveDate,
        canCheckInToday: !hasCheckedInToday,
      },
      message: 'Lấy thông tin streak thành công',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check-in streak
// @route   POST /api/users/me/streak/checkin
// @access  Private
exports.checkinStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    const lastActiveDay = lastActive ? new Date(lastActive) : null;
    if (lastActiveDay) {
      lastActiveDay.setHours(0, 0, 0, 0);
    }

    // Kiểm tra xem đã check-in hôm nay chưa
    if (lastActiveDay && isSameDay(today, lastActiveDay)) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã check-in hôm nay rồi',
      });
    }

    let newStreak = user.streakDays || 0;

    if (!lastActiveDay) {
      // Lần đầu check-in
      newStreak = 1;
    } else if (isSameDay(today, lastActiveDay)) {
      // Đã check-in hôm nay
      return res.status(400).json({
        success: false,
        message: 'Bạn đã check-in hôm nay rồi',
      });
    } else if (isConsecutiveDay(lastActiveDay, today)) {
      // Ngày liên tiếp, tăng streak
      newStreak = (user.streakDays || 0) + 1;
    } else {
      // Không liên tiếp, reset streak
      newStreak = 1;
    }

    // Cập nhật streak và lastActiveDate
    user.streakDays = newStreak;
    user.lastActiveDate = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        currentStreak: newStreak,
        longestStreak: newStreak,
        lastCheckIn: user.lastActiveDate,
        canCheckInToday: false,
      },
      message: 'Check-in thành công',
    });
  } catch (error) {
    next(error);
  }
};

