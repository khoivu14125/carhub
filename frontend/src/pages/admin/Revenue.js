import React, { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';
import {
  DollarSign,
  Receipt,
  CalendarDays,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Revenue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await API.get('/admin/orders');
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu doanh thu:', err);
        setError('Không thể tải dữ liệu doanh thu.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (value) =>
    `${new Intl.NumberFormat('vi-VN').format(value || 0)}đ`;

  const isSuccessfulOrder = (order) => {
    return (
      order.paymentStatus === 'paid' ||
      order.payment_status === 'paid' ||
      order.status === 'completed' ||
      order.status === 'success' ||
      order.transactionStatus === 'completed' ||
      order.transactionStatus === 'success' ||
      order.order_status === 'confirmed'
    );
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const d = new Date(order.created_at);

      if (filter === 'today') {
        return d.toDateString() === now.toDateString();
      }

      if (filter === 'month') {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (filter === 'year') {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [orders, filter]);

  const successfulOrders = useMemo(() => {
    return filteredOrders.filter(isSuccessfulOrder);
  }, [filteredOrders]);

  const totalRevenue = successfulOrders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );

  const totalOrders = filteredOrders.length;
  const successCount = successfulOrders.length;
  const averageRevenue =
    successCount > 0 ? Math.round(totalRevenue / successCount) : 0;

  const todayRevenue = useMemo(() => {
    const now = new Date();
    return orders
      .filter(
        (order) =>
          isSuccessfulOrder(order) &&
          new Date(order.created_at).toDateString() === now.toDateString()
      )
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  }, [orders]);

  const monthRevenue = useMemo(() => {
    const now = new Date();
    return orders
      .filter((order) => {
        const d = new Date(order.created_at);
        return (
          isSuccessfulOrder(order) &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  }, [orders]);

  const yearRevenue = useMemo(() => {
    const now = new Date();
    return orders
      .filter(
        (order) =>
          isSuccessfulOrder(order) &&
          new Date(order.created_at).getFullYear() === now.getFullYear()
      )
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  }, [orders]);

  const chartData = {
    labels: ['Hôm nay', 'Tháng này', 'Năm nay'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [todayRevenue, monthRevenue, yearRevenue],
        backgroundColor: [
          'rgba(34, 197, 94, 0.65)',
          'rgba(16, 185, 129, 0.65)',
          'rgba(5, 150, 105, 0.65)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(16, 185, 129)',
          'rgb(5, 150, 105)',
        ],
        borderWidth: 1.5,
        borderRadius: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 13,
            weight: 'bold',
          },
          boxWidth: 18,
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            return ` ${formatCurrency(context.raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          callback: function (value) {
            return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
          },
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
      },
    },
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Doanh thu hệ thống
          </h1>
          <p className="text-gray-500 mt-3 text-base md:text-lg">
            Thống kê doanh thu từ các giao dịch thành công.
          </p>
        </div>

        <div className="flex items-center bg-[#0b0b0b] border border-gray-800 rounded-full p-1 shadow-inner backdrop-blur-md self-start xl:self-auto">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'today', label: 'Hôm nay' },
            { key: 'month', label: 'Tháng' },
            { key: 'year', label: 'Năm' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === item.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-[#111111] p-6 rounded-3xl border border-gray-800 hover:border-green-500/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center mb-5">
            <DollarSign size={26} />
          </div>
          <p className="text-gray-400 text-sm">Tổng doanh thu</p>
          <p className="text-3xl font-black mt-2 text-white">
            {formatCurrency(totalRevenue)}
          </p>
        </div>

        <div className="bg-[#111111] p-6 rounded-3xl border border-gray-800 hover:border-orange-500/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-5">
            <Receipt size={26} />
          </div>
          <p className="text-gray-400 text-sm">Tổng giao dịch trong kỳ</p>
          <p className="text-3xl font-black mt-2 text-white">{totalOrders}</p>
        </div>

        <div className="bg-[#111111] p-6 rounded-3xl border border-gray-800 hover:border-blue-500/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
            <CreditCard size={26} />
          </div>
          <p className="text-gray-400 text-sm">Thành công</p>
          <p className="text-3xl font-black mt-2 text-white">{successCount}</p>
        </div>

        <div className="bg-[#111111] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
            <TrendingUp size={26} />
          </div>
          <p className="text-gray-400 text-sm">TB / giao dịch</p>
          <p className="text-3xl font-black mt-2 text-white">
            {formatCurrency(averageRevenue)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] p-6 rounded-3xl border border-gray-800">
          <p className="text-sm text-gray-400">Doanh thu hôm nay</p>
          <h3 className="text-2xl font-black text-green-400 mt-2">
            {formatCurrency(todayRevenue)}
          </h3>
        </div>

        <div className="bg-[#111111] p-6 rounded-3xl border border-gray-800">
          <p className="text-sm text-gray-400">Doanh thu tháng này</p>
          <h3 className="text-2xl font-black text-green-400 mt-2">
            {formatCurrency(monthRevenue)}
          </h3>
        </div>

        <div className="bg-[#111111] p-6 rounded-3xl border border-gray-800">
          <p className="text-sm text-gray-400">Doanh thu năm nay</p>
          <h3 className="text-2xl font-black text-green-400 mt-2">
            {formatCurrency(yearRevenue)}
          </h3>
        </div>
      </div>

      <div className="bg-[#111111] p-6 md:p-8 rounded-3xl border border-gray-800 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Biểu đồ doanh thu hệ thống</h2>
        </div>
        <div className="h-[420px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-[#111111] rounded-3xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <CalendarDays className="text-blue-400" size={22} />
          <h2 className="text-2xl font-bold text-white">
            Chi tiết doanh thu theo giao dịch thành công
          </h2>
        </div>

        {successfulOrders.length === 0 ? (
          <div className="p-8 text-gray-500 text-center">
            Không có dữ liệu doanh thu trong khoảng thời gian này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="p-5">Mã đơn</th>
                  <th className="p-5">Khách hàng</th>
                  <th className="p-5">Thanh toán</th>
                  <th className="p-5">Tổng tiền</th>
                  <th className="p-5">Ngày đặt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {successfulOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition">
                    <td className="p-5 text-blue-500 font-mono">#ORD-{order.id}</td>
                    <td className="p-5 text-white">
                      {order.buyerName || order.full_name || '---'}
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white uppercase text-[10px]">
                          {order.paymentMethod || '---'}
                        </span>
                        <span className="text-green-500">● Giao dịch thành công</span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-green-400">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="p-5 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Revenue;