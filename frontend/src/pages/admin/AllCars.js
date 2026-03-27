import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';

const AllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await API.get('/cars/admin/all');
        console.log('API /cars/admin/all =>', res.data);

        const carsData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.cars)
          ? res.data.cars
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setCars(carsData);
      } catch (error) {
        console.error('Lỗi lấy danh sách tất cả xe:', error);
        setError('Không thể tải danh sách xe trong hệ thống.');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const formatCurrency = (value) =>
    `${new Intl.NumberFormat('vi-VN').format(value || 0)}đ`;

  const formatDate = (date) => {
    if (!date) return '---';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return {
          text: 'Đã duyệt',
          className: 'text-green-400',
        };
      case 'pending':
        return {
          text: 'Chờ duyệt',
          className: 'text-yellow-400',
        };
      case 'rejected':
        return {
          text: 'Từ chối',
          className: 'text-red-400',
        };
      case 'sold':
        return {
          text: 'Đã bán',
          className: 'text-blue-400',
        };
      default:
        return {
          text: status || '---',
          className: 'text-gray-300',
        };
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Tất cả xe trong hệ thống</h1>
        <p className="text-gray-500 mt-1">
          Admin có thể xem toàn bộ xe được đăng bởi các seller.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl">
          {error}
        </div>
      )}

      <div className="bg-[#111111] border border-gray-800 rounded-3xl overflow-hidden">
        {cars.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có xe nào trong hệ thống.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className="bg-gray-900/50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="p-5">Mã xe</th>
                  <th className="p-5">Tên xe</th>
                  <th className="p-5">Người bán</th>
                  <th className="p-5">Giá</th>
                  <th className="p-5">Trạng thái</th>
                  <th className="p-5">Ngày đăng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {cars.map((car) => {
                  const status = getStatusLabel(car.status);

                  return (
                    <tr key={car.id} className="hover:bg-white/5 transition">
                      <td className="p-5 text-blue-500 font-mono">#CAR-{car.id}</td>

                      <td className="p-5 text-white">
                        {car.brand} {car.model_name}
                      </td>

                      <td className="p-5 text-white">
                        {car.seller_name || `Seller #${car.seller_id}`}
                      </td>

                      <td className="p-5 font-bold text-white">
                        {formatCurrency(car.price)}
                      </td>

                      <td className={`p-5 font-medium ${status.className}`}>
                        {status.text}
                      </td>

                      <td className="p-5 text-gray-500">
                        {formatDate(car.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCars;