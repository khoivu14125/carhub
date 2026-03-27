const ViewingRequest = require('../models/viewingRequest');
const Car = require('../models/Car');

const viewingRequestController = {
  createRequest: async (req, res) => {
    try {
      const { car_id, full_name, phone_number, preferred_time, message } = req.body;

      const car = await Car.getById(car_id);
      if (!car) {
        return res.status(404).json({ message: 'Không tìm thấy xe' });
      }

      await ViewingRequest.create({
        car_id,
        seller_id: car.seller_id,
        buyer_id: req.user?.id || null,
        full_name,
        phone_number,
        preferred_time,
        message
      });

      res.status(201).json({ message: 'Gửi yêu cầu xem xe thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSellerRequests: async (req, res) => {
    try {
      const requests = await ViewingRequest.getBySellerId(req.user.id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateRequestStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      }

      const result = await ViewingRequest.updateStatus(id, req.user.id, status);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy yêu cầu để cập nhật' });
      }

      res.json({ message: 'Cập nhật trạng thái yêu cầu thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = viewingRequestController;