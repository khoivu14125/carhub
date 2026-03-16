import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * @param {Array} allowedRoles - Danh sách các quyền được phép truy cập (VD: ['admin', 'seller'])
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const location = useLocation();
    
    // Lấy thông tin xác thực từ localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Nếu không có token -> Chưa đăng nhập, đẩy về trang Login
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Nếu đã đăng nhập nhưng role không nằm trong danh sách cho phép (ví dụ Buyer vào trang Admin)
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    // 3. Hợp lệ -> Render các Route con bên trong (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;