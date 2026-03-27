const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @route   GET /api/cars
// @desc    Lấy danh sách xe đã duyệt cho Buyer (Công khai)
router.get('/', carController.getInventory);

// @route   GET /api/cars/pending
// @desc    Admin lấy danh sách xe chờ duyệt
router.get(
  '/pending',
  protect,
  authorize('admin'),
  carController.getPendingCars
);

// @route   GET /api/cars/admin/all
// @desc    Admin lấy tất cả xe trong hệ thống
router.get(
  '/admin/all',
  protect,
  authorize('admin'),
  carController.getAllCarsForAdmin
);

// @route   GET /api/cars/seller/stats
// @desc    Seller lấy thống kê dashboard
router.get(
  '/seller/stats',
  protect,
  authorize('seller'),
  carController.getSellerStats
);

// @route   GET /api/cars/seller/my-cars
// @desc    Seller lấy danh sách xe của chính mình
router.get(
  '/seller/my-cars',
  protect,
  authorize('seller'),
  carController.getMyCars
);

// @route   GET /api/cars/seller/:id
// @desc    Seller lấy chi tiết 1 bài đăng của mình để sửa
router.get(
  '/seller/:id',
  protect,
  authorize('seller'),
  carController.getSellerCarById
);

// @route   PUT /api/cars/seller/:id
// @desc    Seller cập nhật bài đăng
router.put(
  '/seller/:id',
  protect,
  authorize('seller'),
  upload.array('images', 10),
  carController.updateSellerCar
);

// @route   POST /api/cars/post-car
// @desc    Người bán đăng tin
router.post(
  '/post-car',
  protect,
  authorize('seller'),
  upload.array('images', 10),
  carController.postCar
);

// @route   PUT /api/cars/approve/:id
// @desc    Admin duyệt hoặc từ chối xe
router.put(
  '/approve/:id',
  protect,
  authorize('admin'),
  carController.approveCar
);

// @route   GET /api/cars/:id
// @desc    Lấy chi tiết xe
router.get('/:id', carController.getCarById);

module.exports = router;