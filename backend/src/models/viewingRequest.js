const db = require('../config/db');

const viewingRequest = {
  create: async (data) => {
    const { car_id, seller_id, buyer_id, full_name, phone_number, preferred_time, message } = data;

    const sql = `
      INSERT INTO ViewingRequests
      (car_id, seller_id, buyer_id, full_name, phone_number, preferred_time, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const [result] = await db.query(sql, [
      car_id,
      seller_id,
      buyer_id || null,
      full_name,
      phone_number,
      preferred_time,
      message
    ]);

    return result;
  },

  getBySellerId: async (sellerId) => {
    const sql = `
      SELECT 
        ViewingRequests.*,
        Cars.brand,
        Cars.model_name,
        Cars.images
      FROM ViewingRequests
      JOIN Cars ON ViewingRequests.car_id = Cars.id
      WHERE ViewingRequests.seller_id = ?
      ORDER BY ViewingRequests.created_at DESC
    `;

    const [rows] = await db.query(sql, [sellerId]);
    return rows;
  },

  updateStatus: async (id, sellerId, status) => {
    const sql = `
      UPDATE ViewingRequests
      SET status = ?
      WHERE id = ? AND seller_id = ?
    `;
    const [result] = await db.query(sql, [status, id, sellerId]);
    return result;
  },

  countPendingBySellerId: async (sellerId) => {
    const sql = `
      SELECT COUNT(*) AS total
      FROM ViewingRequests
      WHERE seller_id = ? AND status = 'pending'
    `;
    const [rows] = await db.query(sql, [sellerId]);
    return rows[0].total;
  }
};

module.exports = viewingRequest;