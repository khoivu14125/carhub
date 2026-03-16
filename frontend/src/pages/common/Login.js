import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import CustomButton from '../../components/ui/CustomButton';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(formData);
            navigate('/'); // Đăng nhập xong về trang chủ
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Chào mừng trở lại</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input 
                        type="email" placeholder="Email" required
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-all"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input 
                        type="password" placeholder="Mật khẩu" required
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-all"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                <CustomButton type="submit" className="w-full" icon={LogIn}>Đăng nhập</CustomButton>
            </form>
            <p className="text-center mt-6 text-gray-400">Chưa có tài khoản? <Link to="/register" className="text-blue-500 hover:underline">Đăng ký ngay</Link></p>
        </div>
    );
};

export default Login;