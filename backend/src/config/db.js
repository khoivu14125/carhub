const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Xuất ra dưới dạng Promise để dùng async/await cho mượt
const db = pool.promise();

// Hàm kiểm tra kết nối ngay khi chạy server
const testConnection = async () => {
    try {
        await db.query('SELECT 1');
        console.log('✅ Kết nối thành công tới Database: carhub_db');
    } catch (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
    }
};

testConnection();

module.exports = db;