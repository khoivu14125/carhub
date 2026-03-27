import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Clock3,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ClipboardList,
  DollarSign,
} from 'lucide-react';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';
import CustomButton from '../../components/ui/CustomButton';

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeCars: 0,
    pendingCars: 0,
    viewingRequests: 0,
    transactionRequests: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await API.get('/cars/seller/stats');

        setStats({
          activeCars: res.data?.activeCars || 0,
          pendingCars: res.data?.pendingCars || 0,
          viewingRequests: res.data?.viewingRequests || 0,
          transactionRequests: res.data?.transactionRequests || 0,
          totalRevenue: res.data?.totalRevenue || 0,
        });
      } catch (err) {
        console.error('Lỗi lấy thống kê seller:', err);
        setError('Không thể tải dữ liệu thống kê người bán.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value) =>
    `${new Intl.NumberFormat('vi-VN').format(value || 0)}đ`;

  if (loading) return <Loader />;

  const statCards = [
    {
      label: 'Xe đang bán',
      value: stats.activeCars,
      icon: Car,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/40',
      path: '/seller/manage-cars?status=approved',
      hint: 'Chỉ gồm các xe đã được duyệt',
    },
    {
      label: 'Chờ phê duyệt',
      value: stats.pendingCars,
      icon: Clock3,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'hover:border-yellow-500/40',
      path: '/seller/manage-cars?status=pending',
      hint: 'Các xe đang chờ admin duyệt',
    },
    {
      label: 'Yêu cầu xem xe',
      value: stats.viewingRequests,
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'hover:border-red-500/40',
      path: '/seller/view-requests',
      hint: 'Các yêu cầu khách muốn xem xe',
    },
    {
      label: 'Yêu cầu giao dịch',
      value: stats.transactionRequests,
      icon: ClipboardList,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'hover:border-green-500/40',
      path: '/seller/orders',
      hint: 'Các yêu cầu mua xe của khách',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Bảng điều khiển Người bán
          </h1>
          <p className="text-gray-500 mt-3 text-base md:text-lg">
            Chào mừng trở lại! Kiểm tra tình trạng kinh doanh của bạn hôm nay.
          </p>
        </div>

        <Link to="/seller/post-car">
          <CustomButton className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 rounded-2xl">
            <PlusCircle size={20} />
            Đăng tin bán xe mới
          </CustomButton>
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => navigate(card.path)}
            className={`group bg-[#111111] p-6 rounded-3xl border border-gray-800 ${card.border} text-left transition-all duration-300 hover:-translate-y-1`}
          >
            <div
              className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
            >
              <card.icon size={26} />
            </div>

            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-3xl font-black mt-2 text-white">{card.value}</p>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link to="/seller/manage-cars" className="block group">
          <div className="bg-[#111111] p-8 rounded-3xl border border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-800/30 hover:border-blue-500/50 transition-all duration-300 min-h-[170px]">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                Quản lý kho xe
              </h3>
              <p className="text-gray-500 text-sm">
                Chỉnh sửa thông tin hoặc xóa các xe bạn đã đăng.
              </p>
            </div>
            <div className="p-3 bg-gray-900 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <ArrowRight size={24} />
            </div>
          </div>
        </Link>

        <button
          onClick={() => navigate('/seller/orders')}
          className="block group text-left"
        >
          <div className="bg-[#111111] p-8 rounded-3xl border border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-800/30 hover:border-green-500/50 transition-all duration-300 min-h-[170px] w-full">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors">
                Doanh thu
              </h3>
              <p className="text-gray-500 text-sm">
                Xem tổng doanh thu từ các giao dịch thành công của bạn.
              </p>
              <p className="text-3xl font-black text-green-400 mt-4">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-gray-900 rounded-full group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              <ArrowRight size={24} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;