const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../config/mailer');

const authController = {

    // REGISTER
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            const userExists = await User.findByEmail(email);
            if (userExists) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({ name, email, password: hashedPassword, role });

            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // LOGIN
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role
                }
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // FORGOT PASSWORD
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(200).json({
                    message: 'Nếu email tồn tại, liên kết đã được gửi.'
                });
            }

            const rawToken = crypto.randomBytes(32).toString('hex');

            const hashedToken = crypto
                .createHash('sha256')
                .update(rawToken)
                .digest('hex');

            const expire = Date.now() + 15 * 60 * 1000;

            await User.saveResetToken(email, hashedToken, expire);

            const resetLink = `http://localhost:3000/reset-password/${rawToken}`;

            await sendEmail({        
                to: email,
                subject: 'Đặt lại mật khẩu',
                html: `
                    <h2>Đặt lại mật khẩu</h2>
                    <p>Bấm vào link bên dưới:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>Link hết hạn sau 15 phút</p>
                `,
            });

            res.json({
                message: 'Email reset đã được gửi'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },

    // RESET PASSWORD
    resetPassword: async (req, res) => {
        try {
            const { token, password } = req.body;

            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const user = await User.findByResetToken(hashedToken);

            if (!user) {
                return res.status(400).json({
                    message: 'Token không hợp lệ hoặc hết hạn'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await User.updatePasswordAndClearToken(user.id, hashedPassword);

            res.json({ message: 'Đổi mật khẩu thành công' });

        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
};

module.exports = authController;