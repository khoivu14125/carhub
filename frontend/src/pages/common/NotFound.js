import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => (
    <div className="text-center py-40">
        <AlertCircle size={80} className="mx-auto text-blue-600 mb-6 animate-bounce" />
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <p className="text-2xl text-gray-400 mb-8">Trang bạn đang tìm kiếm không tồn tại.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition">Quay lại trang chủ</Link>
    </div>
);

export default NotFound;