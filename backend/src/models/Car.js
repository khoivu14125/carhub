const db = require('../config/db');

const Car = {
    // Đăng tin bán xe mới (Seller)
    create: async (carData) => {
        const { brand, model_name, year, price, specs, description, images, seller_id } = carData;
        const sql = `INSERT INTO Cars (brand, model_name, year, price, specs, description, images, seller_id, status) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`;
        const [result] = await db.query(sql, [
            brand,
            model_name,
            year,
            price,
            specs,
            description,
            images,
            seller_id
        ]);
        return result;
    },

    // Lấy danh sách xe chờ duyệt (Admin xem)
    getPending: async () => {
        const sql = `
            SELECT 
                Cars.*,
                Users.name AS seller_name
            FROM Cars
            LEFT JOIN Users ON Cars.seller_id = Users.id
            WHERE Cars.status = 'pending'
            ORDER BY Cars.id DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    },

    // Admin lấy tất cả xe trong hệ thống
    getAllForAdmin: async () => {
        const sql = `
            SELECT 
                Cars.*,
                Users.name AS seller_name
            FROM Cars
            LEFT JOIN Users ON Cars.seller_id = Users.id
            ORDER BY Cars.id DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    },

    // Lấy danh sách xe đã được duyệt (Buyer xem)
    getAllApproved: async (filters = {}) => {
        let sql = "SELECT * FROM Cars WHERE status = 'approved'";
        const params = [];

        if (filters.keyword) {
            sql += " AND (brand LIKE ? OR model_name LIKE ?)";
            params.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
        }

        if (filters.brand) {
            sql += " AND brand = ?";
            params.push(filters.brand);
        }

        if (filters.maxPrice) {
            sql += " AND price <= ?";
            params.push(filters.maxPrice);
        }

        sql += " ORDER BY id DESC";

        const [rows] = await db.query(sql, params);
        return rows;
    },

    // Xem chi tiết xe
    getById: async (id) => {
        const sql = `
            SELECT Cars.*, Users.name AS seller_name, Users.phone AS seller_phone
            FROM Cars
            JOIN Users ON Cars.seller_id = Users.id
            WHERE Cars.id = ?
        `;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    // Cập nhật trạng thái xe (Admin duyệt hoặc Seller đánh dấu đã bán)
    updateStatus: async (id, status) => {
        const sql = 'UPDATE Cars SET status = ? WHERE id = ?';
        return db.query(sql, [status, id]);
    },

    // Seller lấy 1 bài đăng của chính mình để sửa
    getByIdAndSeller: async (id, seller_id) => {
        const sql = `SELECT * FROM Cars WHERE id = ? AND seller_id = ?`;
        const [rows] = await db.query(sql, [id, seller_id]);
        return rows[0];
    },

    // Seller lấy danh sách xe của mình
    getBySellerId: async (seller_id) => {
        const sql = 'SELECT * FROM Cars WHERE seller_id = ? ORDER BY id DESC';
        const [rows] = await db.query(sql, [seller_id]);
        return rows;
    },

    // Seller cập nhật bài đăng
    updateBySeller: async (id, seller_id, carData) => {
        const { brand, model_name, year, price, specs, description, images } = carData;

        const sql = `
            UPDATE Cars
            SET brand = ?, model_name = ?, year = ?, price = ?, specs = ?, description = ?, images = ?
            WHERE id = ? AND seller_id = ?
        `;

        const [result] = await db.query(sql, [
            brand,
            model_name,
            year,
            price,
            specs,
            description,
            images,
            id,
            seller_id
        ]);

        return result;
    },

    // Đếm tổng số xe cho Admin dashboard
    countCars: async () => {
        const sql = 'SELECT COUNT(*) AS total FROM Cars';
        const [rows] = await db.query(sql);
        return rows[0].total;
    },

    // Thống kê cho Seller dashboard
    getSellerStats: async (seller_id) => {
        const [[activeCars]] = await db.query(
            "SELECT COUNT(*) AS total FROM Cars WHERE seller_id = ? AND status = 'approved'",
            [seller_id]
        );

        const [[pendingCars]] = await db.query(
            "SELECT COUNT(*) AS total FROM Cars WHERE seller_id = ? AND status = 'pending'",
            [seller_id]
        );

        return {
            activeCars: activeCars.total,
            pendingCars: pendingCars.total
        };
    },
};

module.exports = Car;