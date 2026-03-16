import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Clock, DollarSign, AlertCircle, PlusCircle, ArrowRight } from 'lucide-react';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';
import CustomButton from '../../components/ui/CustomButton';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/cars/seller/stats'); 
                setStats(res.data);
            } catch (err) {
                console.error("Lỗi lấy thống kê:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    const statCards = [
        { label: 'Xe đang bán', value: stats?.activeCars || 0, icon: Car, color: 'text-blue-500' },
        { label: 'Chờ phê duyệt', value: stats?.pendingCars || 0, icon: Clock, color: 'text-yellow-500' },
        { label: 'Đơn hàng mới', value: stats?.newOrders || 0, icon: AlertCircle, color: 'text-red-500' },
        { label: 'Doanh thu dự kiến', value: `${new Intl.NumberFormat('vi-VN').format(stats?.totalRevenue || 0)}đ`, icon: DollarSign, color: 'text-green-500' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header với Nút bấm Đăng tin */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        Bảng điều khiển Người bán
                    </h1>
                    <p className="text-gray-500 mt-1">Chào mừng trở lại! Kiểm tra tình trạng kinh doanh của bạn hôm nay.</p>
                </div>
                
                <Link to="/seller/post-car">
                    <CustomButton className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20">
                        <PlusCircle size={20} />
                        Đăng tin bán xe mới
                    </CustomButton>
                </Link>
            </div>

            {/* Grid Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-[#111111] p-6 rounded-2xl border border-gray-800 flex items-center gap-4 hover:border-blue-500/50 transition-all group">
                        <div className={`p-3 bg-gray-900 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                            <card.icon size={28}/>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">{card.label}</p>
                            <p className="text-2xl font-bold">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Khu vực thao tác nhanh - ĐÃ CẬP NHẬT NÚT BẤM */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                
                {/* Nút Quản lý kho xe */}
                <Link to="/seller/manage-cars" className="block group">
                    <div className="bg-[#111111] p-8 rounded-3xl border border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-800/30 hover:border-blue-500/50 transition-all duration-300">
                        <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Quản lý kho xe</h3>
                            <p className="text-gray-500 text-sm">Chỉnh sửa thông tin hoặc xóa các xe bạn đã đăng.</p>
                        </div>
                        <div className="p-3 bg-gray-900 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <ArrowRight size={24} />
                        </div>
                    </div>
                </Link>

                {/* Nút Yêu cầu giao dịch */}
                <Link to="/seller/orders" className="block group">
                    <div className="bg-[#111111] p-8 rounded-3xl border border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-800/30 hover:border-purple-500/50 transition-all duration-300">
                        <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Yêu cầu giao dịch</h3>
                            <p className="text-gray-500 text-sm">Xem danh sách khách hàng đang quan tâm đến xe của bạn.</p>
                        </div>
                        <div className="p-3 bg-gray-900 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                            <ArrowRight size={24} />
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default Dashboard;