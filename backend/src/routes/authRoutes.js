const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Đăng ký tài khoản mới
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Đăng nhập và nhận Token
router.post('/login', authController.login);

module.exports = router;