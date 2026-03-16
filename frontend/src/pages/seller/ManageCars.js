import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import Loader from '../../components/ui/Loader';
import { Edit3, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageCars = () => {
    const [myCars, setMyCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCars = async () => {
            try {
                const res = await API.get('/cars/seller/my-cars');
                setMyCars(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCars();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Quản lý tin đăng</h1>

            <div className="bg-[#111111] rounded-2xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-5">Thông tin xe</th>
                            <th className="p-5">Giá niêm yết</th>
                            <th className="p-5">Trạng thái</th>
                            <th className="p-5 text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-800">
                        {myCars.map((car) => (
                            <tr key={car.id} className="hover:bg-blue-500/5 transition-colors">
                                <td className="p-5 flex items-center gap-4">
                                    <img
                                        src={car.images?.split(',')[0]}
                                        alt={`${car.brand} ${car.model_name}`}
                                        className="w-20 h-14 object-cover rounded-lg"
                                    />
                                    <div>
                                        <p className="font-bold">{car.brand} {car.model_name}</p>
                                        <p className="text-xs text-gray-500">ID: #{car.id}</p>
                                    </div>
                                </td>

                                <td className="p-5 font-semibold text-blue-400">
                                    {new Intl.NumberFormat('vi-VN').format(car.price)}đ
                                </td>

                                <td className="p-5">
                                    <span
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            car.status === 'approved'
                                                ? 'bg-green-500/20 text-green-500'
                                                : car.status === 'pending'
                                                ? 'bg-yellow-500/20 text-yellow-500'
                                                : 'bg-red-500/20 text-red-500'
                                        }`}
                                    >
                                        {car.status === 'approved'
                                            ? 'Đã duyệt'
                                            : car.status === 'pending'
                                            ? 'Chờ duyệt'
                                            : 'Từ chối'}
                                    </span>
                                </td>

                                <td className="p-5 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            to={`/seller/edit-car/${car.id}`}
                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                                            title="Chỉnh sửa bài đăng"
                                        >
                                            <Edit3 size={16} />
                                            <span className="hidden sm:inline">Chỉnh sửa</span>
                                        </Link>

                                        <button
                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 transition"
                                            title="Xóa bài đăng"
                                        >
                                            <Trash2 size={16} />
                                            <span className="hidden sm:inline">Xóa</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {myCars.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        Bạn chưa có tin đăng nào.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCars;