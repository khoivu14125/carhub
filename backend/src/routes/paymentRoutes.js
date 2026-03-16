const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// @route   POST /api/payment/callback
// @desc    Nhận phản hồi từ cổng thanh toán để cập nhật đơn hàng
// Lưu ý: Route này thường để công khai để Server-to-Server gọi IPN
router.post('/callback', paymentController.handlePaymentCallback);

module.exports = router;