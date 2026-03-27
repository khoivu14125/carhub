import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import authService from '../../services/authService';
import CustomButton from '../../components/ui/CustomButton';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!password || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            const res = await authService.resetPassword({ token, password });
            setMessage(res.message || 'Đặt lại mật khẩu thành công');

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            console.log('Reset password error:', err);
            console.log('Response:', err.response?.data);
            setError(err.response?.data?.message || 'Không thể đặt lại mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full p-8 bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-4 bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Đặt lại mật khẩu
                </h2>

                <p className="text-gray-400 text-sm text-center mb-8">
                    Nhập mật khẩu mới cho tài khoản của bạn
                </p>

                {message && (
                    <p className="text-green-500 text-sm mb-4 text-center">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mật khẩu mới"
                            required
                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-blue-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Xác nhận mật khẩu mới"
                            required
                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-blue-500 transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500 hover:text-white"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <CustomButton type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Xác nhận'}
                    </CustomButton>
                </form>

                <p className="text-center mt-6 text-gray-400">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 hover:underline"
                    >
                        <ArrowLeft size={16} />
                        Quay lại đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;