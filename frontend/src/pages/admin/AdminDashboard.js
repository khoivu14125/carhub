import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';
import {
  Users,
  Car,
  ShoppingCart,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/users/admin/stats');

        setStats({
          totalUsers: res.data?.totalUsers || 0,
          totalCars: res.data?.totalCars || 0,
          totalOrders: res.data?.totalOrders || 0,
          totalRevenue: res.data?.totalRevenue || 0,
        });
      } catch (err) {
        console.error('Lỗi lấy thống kê admin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const formatCurrency = (value) =>
    `${new Intl.NumberFormat('vi-VN').format(value || 0)}đ`;

  if (loading) return <Loader />;

  const cards = [
    {
      label: 'Người dùng',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/40',
      shadow: 'hover:shadow-blue-500/10',
      path: '/admin/users',
      hint: 'Quản lý tài khoản',
    },
    {
      label: 'Tổng xe',
      value: stats.totalCars,
      icon: Car,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/40',
      shadow: 'hover:shadow-purple-500/10',
      path: '/admin/all-cars',
      hint: 'Xem tất cả xe từ seller',
    },
    {
      label: 'Đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'hover:border-orange-500/40',
      shadow: 'hover:shadow-orange-500/10',
      path: '/admin/all-orders',
      hint: 'Xem lịch sử và trạng thái giao dịch',
    },
    {
      label: 'Doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'hover:border-green-500/40',
      shadow: 'hover:shadow-green-500/10',
      path: '/admin/revenue',
      hint: 'Xem doanh thu giao dịch thành công',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Hệ thống Quản trị
          </h1>
          <p className="text-gray-500 mt-3 text-base md:text-lg">
            Theo dõi người dùng, xe, giao dịch và doanh thu toàn hệ thống.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => navigate(card.path)}
            className={`group bg-[#111111] p-6 rounded-3xl border border-gray-800 ${card.border} ${card.shadow} shadow-lg text-left transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]`}
          >
            <div
              className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
            >
              <card.icon size={26} />
            </div>

            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-3xl font-black mt-2 text-white wrap-break-word">
              {card.value}
            </p>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-gray-500">{card.hint}</span>
              <ArrowRight
                size={18}
                className="text-gray-500 transition-all duration-300 group-hover:text-white group-hover:translate-x-1"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;