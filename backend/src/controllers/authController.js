const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // Đăng ký
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            const userExists = await User.findByEmail(email);
            if (userExists) return res.status(400).json({ message: 'Email đã tồn tại' });

            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({ name, email, password: hashedPassword, role });
            res.status(201).json({ message: 'Đăng ký tài khoản thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Đăng nhập
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không đúng' });

            // Tạo Token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;