import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { UserCog, ShieldCheck, Trash2 } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await API.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Lỗi lấy danh sách users:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleRole = async (userId, currentRole) => {
        try {
            const newRole = currentRole === 'buyer' ? 'seller' : 'buyer';
            await API.put(`/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (err) {
            console.error('Lỗi đổi vai trò:', err);
        }
    };

    return (
        <div className="bg-[#111111] rounded-3xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <UserCog className="text-blue-500" />
                    Quản lý Thành viên
                </h2>
            </div>

            <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-gray-500 text-xs uppercase">
                    <tr>
                        <th className="p-5">Thành viên</th>
                        <th className="p-5">Email</th>
                        <th className="p-5">Vai trò</th>
                        <th className="p-5 text-right">Hành động</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-800 text-sm">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition">
                                <td className="p-5 font-medium">{user.name}</td>
                                <td className="p-5 text-gray-400">{user.email}</td>
                                <td className="p-5">
                                    <span
                                        className={`px-3 py-1 rounded-lg font-bold text-[10px] ${
                                            user.role === 'admin'
                                                ? 'bg-red-500/20 text-red-500'
                                                : 'bg-blue-500/20 text-blue-500'
                                        }`}
                                    >
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-5 text-right space-x-2">
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => toggleRole(user.id, user.role)}
                                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
                                        >
                                            <ShieldCheck size={18} />
                                        </button>
                                    )}

                                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-8 text-center text-gray-500">
                                Chưa có người dùng nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;