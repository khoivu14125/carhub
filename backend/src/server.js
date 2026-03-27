const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/userRoutes');

// --- IMPORT CẤU HÌNH & KẾT NỐI ---
const db = require('./config/db');

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const viewingRequestRoutes = require('./routes/viewingRequestRoutes');

// 1. Khởi tạo cấu hình biến môi trường
dotenv.config();

const app = express();

// 2. MIDDLEWARES HỆ THỐNG
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. ĐỊNH NGHĨA CÁC API ENDPOINTS
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/viewing-requests', viewingRequestRoutes);

// 4. ROUTE KIỂM TRA TRẠNG THÁI SERVER
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'CarHub API is running perfectly!',
    database: 'MySQL Connected',
    version: '1.0.0'
  });
});

// Static frontend
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Mọi request không phải API sẽ trả về file index.html của frontend
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
});

// 5. XỬ LÝ LỖI 404
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