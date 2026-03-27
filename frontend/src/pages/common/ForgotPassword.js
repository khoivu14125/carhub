import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import authService from '../../services/authService';
import CustomButton from '../../components/ui/CustomButton';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const res = await authService.forgotPassword({ email });
            setMessage(res.message || 'Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.');
        } catch (err) {
            console.log(err);
            console.log(err.response?.data);
            setError(err.response?.data?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-4 bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Quên mật khẩu
            </h2>

            <p className="text-gray-400 text-sm text-center mb-8">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu
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
                    <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <CustomButton type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
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
    );
};

export default ForgotPassword;