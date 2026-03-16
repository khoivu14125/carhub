import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { FileText, Download } from 'lucide-react';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchAllOrders = async () => {
            const res = await API.get('/admin/orders');
            setOrders(res.data);
        };
        fetchAllOrders();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
                <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl font-bold text-sm">
                    <Download size={16}/> Xuất báo cáo (CSV)
                </button>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="p-5">Mã Đơn</th>
                            <th className="p-5">Khách hàng</th>
                            <th className="p-5">Thanh toán</th>
                            <th className="p-5">Tổng tiền</th>
                            <th className="p-5">Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-white/5 transition">
                                <td className="p-5 text-blue-500 font-mono">#ORD-{order.id}</td>
                                <td className="p-5">{order.full_name}</td>
                                <td className="p-5">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white uppercase text-[10px]">{order.paymentMethod}</span>
                                        <span className={order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}>
                                            {order.paymentStatus === 'paid' ? '● Đã quyết toán' : '○ Chờ xử lý'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5 font-bold">{new Intl.NumberFormat('vi-VN').format(order.total_amount)}đ</td>
                                <td className="p-5 text-gray-500">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllOrders;