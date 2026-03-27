const db = require('../config/db');

const User = {
    // Tạo người dùng mới (Đăng ký)
    create: async (userData) => {
        const { name, email, password, role } = userData;
        const sql = 'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [name, email, password, role]);
        return result;
    },

    // Tìm người dùng theo Email (Đăng nhập)
    findByEmail: async (email) => {
        const sql = 'SELECT * FROM Users WHERE email = ?';
        const [rows] = await db.query(sql, [email]);
        return rows[0];
    },

    // Tìm người dùng theo ID (Lấy thông tin profile)
    findById: async (id) => {
        const sql = 'SELECT id, name, email, role, phone, avatar, created_at FROM Users WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    // Cập nhật thông tin
    update: async (id, updateData) => {
        const { name, phone, avatar } = updateData;
        const sql = 'UPDATE Users SET name = ?, phone = ?, avatar = ? WHERE id = ?';
        return db.query(sql, [name, phone, avatar, id]);
    },

    updateProfile: async (id, userData) => {
        const { name, email, phone } = userData;
        const sql = 'UPDATE Users SET name = ?, email = ?, phone = ? WHERE id = ?';
        const [result] = await db.query(sql, [name, email, phone, id]);
        return result;
    },

    getPasswordById: async (id) => {
        const sql = 'SELECT id, password FROM Users WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    updatePassword: async (id, hashedPassword) => {
        const sql = 'UPDATE Users SET password = ? WHERE id = ?';
        const [result] = await db.query(sql, [hashedPassword, id]);
        return result;
    },

    // Đếm tổng user cho Admin dashboard
    countUsers: async () => {
        const sql = 'SELECT COUNT(*) AS total FROM Users';
        const [rows] = await db.query(sql);
        return rows[0].total;
    },

    getAllUsers: async () => {
    const sql = 'SELECT id, name, email, role, phone, created_at FROM Users ORDER BY id DESC';
    const [rows] = await db.query(sql);
    return rows;
},

updateRole: async (id, role) => {
    const sql = 'UPDATE Users SET role = ? WHERE id = ?';
    const [result] = await db.query(sql, [role, id]);
    return result;
},

deleteUser: async (id) => {
    const sql = 'DELETE FROM Users WHERE id = ?';
    const [result] = await db.query(sql, [id]);
    return result;
},

saveResetToken: async (email, token, expire) => {
    const sql = `
        UPDATE Users
        SET reset_password_token = ?, reset_password_expire = ?
        WHERE email = ?
    `;
    const [result] = await db.query(sql, [token, expire, email]);
    return result;
},

findByResetToken: async (token) => {
    const sql = `
        SELECT *
        FROM Users
        WHERE reset_password_token = ?
          AND reset_password_expire > ?
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [token, Date.now()]);
    return rows[0];
},

updatePasswordAndClearToken: async (id, password) => {
    const sql = `
        UPDATE Users
        SET password = ?,
            reset_password_token = NULL,
            reset_password_expire = NULL
        WHERE id = ?
    `;
    const [result] = await db.query(sql, [password, id]);
    return result;
},

};

module.exports = User;