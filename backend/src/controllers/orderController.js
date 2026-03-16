const Car = require('../models/Car');
const Order = require('../models/Order');

const orderController = {
    createOrder: async (req, res) => {
        try {
            const orderData = { ...req.body, buyer_id: req.user.id };
            const orderId = await Order.create(orderData);
            
            res.status(201).json({ 
                message: 'Đơn hàng đã được tạo', 
                orderId,
                paymentMethod: req.body.paymentMethod 
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getMyOrders: async (req, res) => {
        try {
            const orders = await Order.getByBuyerId(req.user.id);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = orderController;