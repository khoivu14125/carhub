const User = require('../models/User');
const Car = require('../models/Car');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

const userController = {
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const avatar = req.file ? req.file.path : req.body.avatar;
            await User.update(req.user.id, { ...req.body, avatar });
            res.json({ message: 'Cập nhật thông tin thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;

            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'Xác nhận mật khẩu không khớp' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
            }

            const user = await User.getPasswordById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.updatePassword(req.user.id, hashedPassword);

            res.json({ message: 'Đổi mật khẩu thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAdminStats: async (req, res) => {
        try {
            const totalUsers = await User.countUsers();
            const totalCars = await Car.countCars();
            const revenueStats = await Order.getRevenueStats();

            res.json({
                totalUsers,
                totalCars,
                totalOrders: revenueStats.totalOrders || 0,
                totalRevenue: revenueStats.totalRevenue || 0
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    getAllUsers: async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

updateUserRole: async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        await User.updateRole(id, role);
        res.json({ message: 'Cập nhật vai trò thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

deleteUser: async (req, res) => {
    try {
        const { id } = req.params;

        if (Number(id) === req.user.id) {
            return res.status(400).json({ message: 'Bạn không thể tự xóa chính mình' });
        }

        await User.deleteUser(id);
        res.json({ message: 'Xóa thành viên thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

};

module.exports = userController;