const Car = require('../models/Car');
const Order = require('../models/Order');

const carController = {
    // Người bán đăng xe
    postCar: async (req, res) => {
        try {
            const imageUrls = req.files.map(file => file.path).join(',');
            const carData = { ...req.body, images: imageUrls, seller_id: req.user.id };

            await Car.create(carData);
            res.status(201).json({ message: 'Đăng tin thành công, vui lòng chờ Admin duyệt' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Admin lấy danh sách xe chờ duyệt
    getPendingCars: async (req, res) => {
        try {
            const cars = await Car.getPending();
            res.json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Admin duyệt xe
    approveCar: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await Car.updateStatus(id, status);
            res.json({ message: `Đã cập nhật trạng thái xe: ${status}` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Buyer xem danh sách xe đã duyệt
    getInventory: async (req, res) => {
        try {
            const cars = await Car.getAllApproved(req.query);
            res.json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Buyer xem chi tiết xe
    getCarById: async (req, res) => {
        try {
            const { id } = req.params;
            const car = await Car.getById(id);

            if (!car) {
                return res.status(404).json({ message: 'Không tìm thấy xe' });
            }

            res.json(car);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Seller dashboard stats
    getSellerStats: async (req, res) => {
        try {
            const carStats = await Car.getSellerStats(req.user.id);
            const orderStats = await Order.getSellerStats(req.user.id);

            res.json({
                activeCars: carStats.activeCars || 0,
                pendingCars: carStats.pendingCars || 0,
                newOrders: orderStats.newOrders || 0,
                totalRevenue: orderStats.totalRevenue || 0
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Seller lấy danh sách bài đăng của mình
    getMyCars: async (req, res) => {
        try {
            const cars = await Car.getBySellerId(req.user.id);
            res.json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Seller lấy chi tiết bài đăng của mình để sửa
    getSellerCarById: async (req, res) => {
        try {
            const { id } = req.params;
            const car = await Car.getByIdAndSeller(id, req.user.id);

            if (!car) {
                return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
            }

            res.json(car);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Seller cập nhật bài đăng
    updateSellerCar: async (req, res) => {
        try {
            const { id } = req.params;

            const oldCar = await Car.getByIdAndSeller(id, req.user.id);
            if (!oldCar) {
                return res.status(404).json({ message: 'Không tìm thấy bài đăng để cập nhật' });
            }

            let keptImages = [];

            if (req.body.keptImages) {
                try {
                    keptImages = JSON.parse(req.body.keptImages);
                } catch (error) {
                    keptImages = [];
                }
            }

            let newImageUrls = [];
            if (req.files && req.files.length > 0) {
                newImageUrls = req.files.map(file => file.path);
            }

            const finalImages = [...keptImages, ...newImageUrls].join(',');

            const carData = {
                ...req.body,
                images: finalImages
            };

            await Car.updateBySeller(id, req.user.id, carData);

            res.json({
                message: 'Cập nhật bài đăng thành công',
                images: finalImages
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = carController;