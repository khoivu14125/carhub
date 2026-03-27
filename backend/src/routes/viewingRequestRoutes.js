const express = require('express');
const router = express.Router();
const viewingRequestController = require('../controllers/viewingRequestController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Buyer gửi yêu cầu
router.post('/', protect, authorize('buyer'), viewingRequestController.createRequest);

// Seller xem danh sách yêu cầu
router.get('/seller/requests', protect, authorize('seller'), viewingRequestController.getSellerRequests);

// Seller cập nhật trạng thái
router.put('/seller/requests/:id', protect, authorize('seller'), viewingRequestController.updateRequestStatus);

module.exports = router;