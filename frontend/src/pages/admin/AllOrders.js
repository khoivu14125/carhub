import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Download } from 'lucide-react';
import Loader from '../../components/ui/Loader';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await API.get('/admin/orders');
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Lỗi lấy lịch sử giao dịch:', err);
        setError('Không thể tải lịch sử giao dịch.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const formatCurrency = (value) =>
    `${new Intl.NumberFormat('vi-VN').format(value || 0)}đ`;

  const formatDate = (date) => {
    if (!date) return '---';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return {
          text: '● Đã thanh toán',
          className: 'text-green-500',
        };
      case 'pending':
        return {
          text: '○ Chờ thanh toán',
          className: 'text-yellow-500',
        };
      case 'failed':
        return {
          text: '● Thanh toán thất bại',
          className: 'text-red-500',
        };
      default:
        return {
          text: '○ Chưa xác định',
          className: 'text-gray-400',
        };
    }
  };

  const getOrderStatusLabel = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return {
          text: 'Hoàn tất',
          className: 'bg-green-500/10 text-green-400 border border-green-500/20',
        };
      case 'processing':
        return {
          text: 'Đang xử lý',
          className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        };
      case 'pending':
        return {
          text: 'Chờ xử lý',
          className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        };
      case 'cancelled':
        return {
          text: 'Đã hủy',
          className: 'bg-red-500/10 text-red-400 border border-red-500/20',
        };
      default:
        return {
          text: 'Không rõ',
          className: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
        };
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Lịch sử giao dịch</h1>
          <p className="text-gray-500 mt-1">
            Admin chỉ có quyền xem lịch sử và trạng thái giao dịch của toàn hệ thống.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl font-bold text-sm text-white">
          <Download size={16} />
          Xuất báo cáo (CSV)
        </button>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl">
          {error}
        </div>
      ) : (
        <div className="bg-[#111111] border border-gray-800 rounded-3xl overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Hiện chưa có giao dịch nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1100px]">
                <thead className="bg-gray-900/50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="p-5">Mã đơn</th>
                    <th className="p-5">Người mua</th>
                    <th className="p-5">Người bán</th>
                    <th className="p-5">Sản phẩm / Xe</th>
                    <th className="p-5">Thanh toán</th>
                    <th className="p-5">Trạng thái giao dịch</th>
                    <th className="p-5">Tổng tiền</th>
                    <th className="p-5">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                  {orders.map((order) => {
                    const paymentStatus = getPaymentStatusLabel(order.paymentStatus);
                    const orderStatus = getOrderStatusLabel(
                      order.status || order.orderStatus || order.transactionStatus
                    );

                    return (
                      <tr key={order.id} className="hover:bg-white/5 transition">
                        <td className="p-5 text-blue-500 font-mono">
                          #ORD-{order.id}
                        </td>

                        <td className="p-5 text-white">
                          {order.buyerName || order.full_name || '---'}
                        </td>

                        <td className="p-5 text-white">
                          {order.sellerName || order.seller_name || '---'}
                        </td>

                        <td className="p-5 text-white">
                          {order.carTitle || order.car_name || order.product_name || '---'}
                        </td>

                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-white uppercase text-[10px]">
                              {order.paymentMethod || '---'}
                            </span>
                            <span className={paymentStatus.className}>
                              {paymentStatus.text}
                            </span>
                          </div>
                        </td>

                        <td className="p-5">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${orderStatus.className}`}
                          >
                            {orderStatus.text}
                          </span>
                        </td>

                        <td className="p-5 font-bold text-white">
                          {formatCurrency(order.total_amount)}
                        </td>

                        <td className="p-5 text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllOrders;