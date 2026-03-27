import React, { useEffect, useState } from 'react';
import carService from '../../services/carService';
import Loader from '../../components/ui/Loader';
import { Check, X } from 'lucide-react';

const ApproveCars = () => {
  const [pendingCars, setPendingCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await carService.getPendingCars();
      setPendingCars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi lấy danh sách xe chờ duyệt:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, status) => {
    const message =
      status === 'approved'
        ? 'Bạn có chắc muốn duyệt tin đăng này không?'
        : 'Bạn có chắc muốn từ chối tin đăng này không?';

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    try {
      await carService.approveCar(id, status);
      alert(status === 'approved' ? 'Đã duyệt xe!' : 'Đã từ chối xe!');
      fetchPending();
    } catch (err) {
      console.error('Lỗi duyệt xe:', err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái tin đăng.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Duyệt tin đăng xe</h2>
        <p className="text-gray-500 mt-1">
          Quản trị viên kiểm duyệt các tin đăng xe mới từ seller trước khi hiển thị công khai.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingCars.map((car) => (
          <div
            key={car.id}
            className="bg-[#111111] p-5 rounded-2xl border border-gray-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={car.images?.split(',')[0]}
                className="w-24 h-16 object-cover rounded-xl"
                alt={car.model_name}
              />

              <div>
                <h3 className="font-bold text-lg text-white">
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
                className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl transition shadow-lg shadow-green-900/20 flex items-center gap-2 text-white font-semibold"
              >
                <Check size={18} />
                Duyệt
              </button>

              <button
                onClick={() => handleAction(car.id, 'rejected')}
                className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl transition shadow-lg shadow-red-900/20 flex items-center gap-2 text-white font-semibold"
              >
                <X size={18} />
                Từ chối
              </button>
            </div>
          </div>
        ))}

        {pendingCars.length === 0 && (
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
            Không có tin đăng nào đang chờ duyệt.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveCars;