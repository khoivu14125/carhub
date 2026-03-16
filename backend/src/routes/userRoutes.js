const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);

router.get(
  '/admin/stats',
  protect,
  authorize('admin'),
  userController.getAdminStats
);

router.get(
  '/',
  protect,
  authorize('admin'),
  userController.getAllUsers
);

router.put(
  '/:id/role',
  protect,
  authorize('admin'),
  userController.updateUserRole
);

module.exports = router;