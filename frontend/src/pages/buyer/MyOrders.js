import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get('/orders/my-orders');
                setOrders(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchOrders();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-10">Đơn hàng của tôi</h1>
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-[#111111] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4 items-center">
                            <img src={order.images?.split(',')[0]} className="w-32 h-20 object-cover rounded-xl" alt="" />
                            <div>
                                <h3 className="text-xl font-bold">{order.brand} {order.model_name}</h3>
                                <p className="text-gray-400">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>
                        <div className="text-right space-y-2 w-full md:w-auto">
                            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                            </div>
                            <p className="text-2xl font-bold text-blue-500">{new Intl.NumberFormat('vi-VN').format(order.total_amount)}đ</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;