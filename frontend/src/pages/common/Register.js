import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import CustomButton from '../../components/ui/CustomButton';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer'
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const { confirmPassword, ...submitData } = formData;
            await authService.register(submitData);
            alert('Đăng ký thành công!');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi đăng ký');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">Tạo tài khoản CarHub</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    type="text"
                    placeholder="Họ và tên"
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 px-4 outline-none focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 px-4 outline-none focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 px-4 outline-none focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 px-4 outline-none focus:border-blue-500"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />

                <div className="flex gap-4">
                    <label className="flex-1">
                        <input
                            type="radio"
                            name="role"
                            value="buyer"
                            checked={formData.role === 'buyer'}
                            className="hidden peer"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                        <div className="text-center p-3 border border-gray-800 rounded-xl peer-checked:border-blue-500 peer-checked:bg-blue-500/10 cursor-pointer transition">
                            Người mua
                        </div>
                    </label>

                    <label className="flex-1">
                        <input
                            type="radio"
                            name="role"
                            value="seller"
                            checked={formData.role === 'seller'}
                            className="hidden peer"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                        <div className="text-center p-3 border border-gray-800 rounded-xl peer-checked:border-blue-500 peer-checked:bg-blue-500/10 cursor-pointer transition">
                            Người bán
                        </div>
                    </label>
                </div>

                <CustomButton type="submit" className="w-full">
                    Đăng ký
                </CustomButton>
            </form>
        </div>
    );
};

export default Register;