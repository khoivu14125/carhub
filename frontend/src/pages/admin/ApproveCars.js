import React, { useEffect, useState } from 'react';
import carService from '../../services/carService';
import { Check, X } from 'lucide-react';

const ApproveCars = () => {
  const [pendingCars, setPendingCars] = useState([]);

  const fetchPending = async () => {
    try {
      const data = await carService.getPendingCars();
      setPendingCars(data);
    } catch (err) {
      console.error('Lỗi lấy danh sách xe chờ duyệt:', err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await carService.approveCar(id, status);
      alert(status === 'approved' ? 'Đã duyệt xe!' : 'Đã từ chối xe!');
      fetchPending();
    } catch (err) {
      console.error('Lỗi duyệt xe:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Duyệt tin đăng xe</h2>

      <div className="grid grid-cols-1 gap-4">
        {pendingCars.map((car) => (
          <div
            key={car.id}
            className="bg-[#111111] p-5 rounded-2xl border border-gray-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={car.images?.split(',')[0]}
                className="w-24 h-16 object-cover rounded-xl"
                alt={car.model_name}
              />

              <div>
                <h3 className="font-bold text-lg">
                  {car.brand} {car.model_name}
                </h3>
                <p className="text-blue-500 font-bold">
                  {new Intl.NumberFormat('vi-VN').format(car.price)}đ
                </p>
                <p className="text-xs text-gray-500">
                  Người đăng: {car.seller_name || `Seller #${car.seller_id}`}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAction(car.id, 'approved')}
                className="bg-green-600 hover:bg-green-700 p-3 rounded-xl transition shadow-lg shadow-green-900/20"
              >
                <Check size={20} />
              </button>

              <button
                onClick={() => handleAction(car.id, 'rejected')}
                className="bg-red-600 hover:bg-red-700 p-3 rounded-xl transition shadow-lg shadow-red-900/20"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}

        {pendingCars.length === 0 && (
          <p className="text-gray-500 italic">Không có tin đăng nào đang chờ duyệt.</p>
        )}
      </div>
    </div>
  );
};

export default ApproveCars;