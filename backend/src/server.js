const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// --- IMPORT CẤU HÌNH & KẾT NỐI ---
const db = require('./config/db'); // Kết nối MySQL Pool

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// 1. Khởi tạo cấu hình biến môi trường
dotenv.config();

const app = express();

// 2. MIDDLEWARES HỆ THỐNG
// Cho phép các domain khác (Frontend) truy cập API
app.use(cors()); 

// Cho phép Server đọc dữ liệu JSON từ request body
app.use(express.json()); 

// Cho phép Server đọc dữ liệu từ URL-encoded (phục vụ một số cổng thanh toán)
app.use(express.urlencoded({ extended: true }));

// 3. ĐỊNH NGHĨA CÁC API ENDPOINTS
// Đồng bộ với các file trong thư mục backend/src/routes/
app.use('/api/auth', authRoutes);       // Đăng ký, Đăng nhập
app.use('/api/cars', carRoutes);       // CRUD xe, Duyệt xe
app.use('/api/orders', orderRoutes);   // Đặt hàng, Lịch sử đơn hàng
app.use('/api/payment', paymentRoutes); // Xử lý thanh toán VNPay/MoMo/PayPal
app.use('/api/users', userRoutes);     // Quản lý người dùng (Admin)
// 4. ROUTE KIỂM TRA TRẠNG THÁI SERVER
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'CarHub API is running perfectly!',
        database: 'MySQL Connected',
        version: '1.0.0'
    });
});

// 5. XỬ LÝ LỖI 404 (Khi client gọi sai URL)
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// 6. MIDDLEWARE XỬ LÝ LỖI TỔNG THỂ
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 7. KHỞI CHẠY SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('-------------------------------------------');
    console.log(`🚀 Server CarHub is running on port: ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log('-------------------------------------------');
});

// backend/src/server.js
const path = require('path');

// Trỏ đến thư mục build của frontend
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Mọi request không phải API sẽ trả về file index.html của frontend
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
});


