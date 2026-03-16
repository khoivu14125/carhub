import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';
import { Users, Car, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
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
        console.log('admin stats:', res.data);

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

  if (loading) return <Loader />;

  const cards = [
    {
      label: 'Người dùng',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/40',
    },
    {
      label: 'Tổng xe',
      value: stats.totalCars,
      icon: Car,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/40',
    },
    {
      label: 'Đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'hover:border-orange-500/40',
    },
    {
      label: 'Doanh thu',
      value: `${new Intl.NumberFormat('vi-VN').format(stats.totalRevenue)}đ`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'hover:border-green-500/40',
    },
  ];

  const chartData = {
    labels: ['Người dùng', 'Tổng xe', 'Đơn hàng', 'Doanh thu'],
    datasets: [
      {
        label: 'Thống kê hệ thống',
        data: [
          stats.totalUsers,
          stats.totalCars,
          stats.totalOrders,
          stats.totalRevenue,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(168, 85, 247, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(34, 197, 94, 0.6)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(249, 115, 22)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 13,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Biểu đồ tổng quan hệ thống',
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
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
          color: 'rgba(255,255,255,0.06)',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255,255,255,0.06)',
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Hệ thống Quản trị
          </h1>
          <p className="text-gray-500 mt-2">
            Theo dõi người dùng, xe, đơn hàng và doanh thu toàn hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-2xl text-sm font-bold">
          <TrendingUp size={18} />
          +12% Tăng trưởng tháng này
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-[#111111] p-6 rounded-3xl border border-gray-800 ${card.border} transition-all duration-300 hover:-translate-y-1`}
          >
            <div
              className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-5`}
            >
              <card.icon size={26} />
            </div>

            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-3xl font-black mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#111111] p-6 md:p-8 rounded-3xl border border-gray-800">
        <div className="h-95">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;