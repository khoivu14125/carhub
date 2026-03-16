const db = require('../config/db');

const Order = {
    // Tạo đơn hàng mới
    create: async (orderData) => {
        const {
            buyer_id,
            car_id,
            total_amount,
            full_name,
            phone_number,
            address,
            paymentMethod
        } = orderData;

        const sql = `INSERT INTO Orders (
                        buyer_id, 
                        car_id, 
                        total_amount, 
                        full_name, 
                        phone_number, 
                        address, 
                        paymentMethod, 
                        paymentStatus
                    ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'unpaid')`;

        const [result] = await db.query(sql, [
            buyer_id,
            car_id,
            total_amount,
            full_name,
            phone_number,
            address,
            paymentMethod
        ]);

        return result.insertId;
    },

    // Cập nhật trạng thái thanh toán khi có Callback từ cổng thanh toán
    updatePaymentStatus: async (orderId, transactionId, status) => {
        const sql = `UPDATE Orders SET
                        transactionId = ?,
                        paymentStatus = ?,
                        paymentDate = NOW(),
                        order_status = IF(? = 'paid', 'confirmed', 'processing')
                     WHERE id = ?`;

        return db.query(sql, [transactionId, status, status, orderId]);
    },

    // Lấy lịch sử đơn hàng của người mua
    getByBuyerId: async (buyerId) => {
        const sql = `SELECT Orders.*, Cars.brand, Cars.model_name, Cars.images
                     FROM Orders
                     JOIN Cars ON Orders.car_id = Cars.id
                     WHERE Orders.buyer_id = ?
                     ORDER BY Orders.created_at DESC`;

        const [rows] = await db.query(sql, [buyerId]);
        return rows;
    },

    // Thống kê doanh thu cho Admin
    getRevenueStats: async () => {
        const sql = `SELECT 
                        COUNT(id) AS totalOrders,
                        COALESCE(SUM(total_amount), 0) AS totalRevenue
                     FROM Orders
                     WHERE paymentStatus = 'paid'`;

        const [rows] = await db.query(sql);
        return rows[0];
    },

    // Thống kê cho Seller dashboard
    getSellerStats: async (sellerId) => {
        const sql = `
            SELECT
                COUNT(Orders.id) AS newOrders,
                COALESCE(SUM(
                    CASE
                        WHEN Orders.paymentStatus = 'paid' THEN Orders.total_amount
                        ELSE 0
                    END
                ), 0) AS totalRevenue
            FROM Orders
            JOIN Cars ON Orders.car_id = Cars.id
            WHERE Cars.seller_id = ?
        `;

        const [rows] = await db.query(sql, [sellerId]);
        return rows[0];
    }
};

module.exports = Order;