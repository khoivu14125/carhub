const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem token có nằm trong Header Authorization (Bearer Token) không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ chuỗi "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin user từ DB (không lấy password) và gán vào req.user
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Token không hợp lệ, quyền truy cập bị từ chối' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có token, bạn cần đăng nhập' });
    }
};

module.exports = { protect };