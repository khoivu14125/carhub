import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { User, Phone, MapPin, CheckCircle2 } from 'lucide-react';

const OrderRequests = () => {
    const [orders, setOrders] = useState([]);
    viewingRequestService.getSellerRequests()
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await viewingRequestService.getSellerRequests();
                setOrders(res.data);
            } catch (err) { console.error(err); }
        };
        fetchOrders();
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Yêu cầu giao dịch</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500 italic">Chưa có yêu cầu mua hàng nào.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="bg-[#111111] border border-gray-800 rounded-3xl p-6 flex flex-col lg:flex-row justify-between gap-6 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all">
                        <div className="flex gap-6">
                            <img src={order.images?.split(',')[0]} className="w-40 h-28 object-cover rounded-2xl border border-gray-800" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">{order.brand} {order.model_name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><User size={14}/> {order.full_name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><Phone size={14}/> {order.phone_number}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400"><MapPin size={14}/> {order.address}</div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                            <div className={`px-4 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                {order.paymentStatus === 'paid' ? 'ĐÃ THANH TOÁN ONLINE' : 'THANH TOÁN COD'}
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Giá trị giao dịch</p>
                                <p className="text-2xl font-bold text-blue-500">{new Intl.NumberFormat('vi-VN').format(order.total_amount)}đ</p>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                <CheckCircle2 size={16}/> Xác nhận đơn
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
    
};

export default OrderRequests;