const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Tạo đơn hàng mới (Chỉ dành cho người đã đăng nhập)
router.post('/', protect, orderController.createOrder);

// @route   GET /api/orders/my-orders
// @desc    Xem lịch sử mua hàng cá nhân
router.get('/my-orders', protect, orderController.getMyOrders);

module.exports = router;