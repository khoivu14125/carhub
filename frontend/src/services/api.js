import axios from 'axios';

// Khởi tạo instance của axios với URL gốc của Backend
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Middleware cho request: Tự động thêm Token vào Header Authorization
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Middleware cho response: Xử lý lỗi tập trung (ví dụ: Token hết hạn)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Nếu lỗi 401 (Unauthorized), có thể logout người dùng
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;