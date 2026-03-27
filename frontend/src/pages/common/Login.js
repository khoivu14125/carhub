import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import CustomButton from '../../components/ui/CustomButton';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await authService.login(formData);
            const redirectTo = location.state?.from || '/';
            navigate(redirectTo);
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Chào mừng trở lại
            </h2>

            {error && (
                <p className="text-red-500 text-sm mb-4 text-center">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-all"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-500" size={20} />

                    <input
                        type={show ? 'text' : 'password'}
                        placeholder="Mật khẩu"
                        required
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-blue-500 transition-all"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />

                    <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-500 hover:text-white"
                        onClick={() => setShow(!show)}
                    >
                        {show ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="text-right -mt-3">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-blue-500 hover:text-blue-400 hover:underline"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                <CustomButton type="submit" className="w-full" icon={LogIn}>
                    Đăng nhập
                </CustomButton>
            </form>

            <p className="text-center mt-6 text-gray-400">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-blue-500 hover:underline">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
};

export default Login;