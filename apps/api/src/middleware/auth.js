/**
 * Authentication Middleware
 * Xác thực JWT token và bảo vệ các route cần đăng nhập
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra token trong header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có token, vui lòng đăng nhập',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Lấy thông tin user từ token (không cần query DB lại nếu không cần thiết)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Người dùng không tồn tại',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message,
    });
  }
};

module.exports = { protect };

