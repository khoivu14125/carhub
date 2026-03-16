const Order = require('../models/Order');

const paymentController = {
    // Xử lý sau khi thanh toán xong (giả sử cho VNPay/MoMo/PayPal)
    handlePaymentCallback: async (req, res) => {
        try {
            // Các cổng thanh toán thường gửi về qua Query hoặc Body
            const { orderId, transactionId, status } = req.body; 
            
            // status nhận từ cổng thanh toán: 'paid' hoặc 'failed'
            await Order.updatePaymentStatus(orderId, transactionId, status);

            res.json({ message: 'Cập nhật trạng thái thanh toán thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = paymentController;