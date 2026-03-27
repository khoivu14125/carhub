const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Đăng ký tài khoản mới
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Đăng nhập và nhận Token
router.post('/login', authController.login);

// ===== QUÊN MẬT KHẨU =====

// @route   POST /api/auth/forgot-password
// @desc    Gửi link reset mật khẩu
router.post('/forgot-password', authController.forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Đặt lại mật khẩu mới
router.post('/reset-password', authController.resetPassword);

module.exports = router;