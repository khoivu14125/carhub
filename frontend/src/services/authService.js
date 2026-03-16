import API from './api';

const authService = {
    // Đăng ký tài khoản
    register: async (userData) => {
        const response = await API.post('/auth/register', userData);
        return response.data;
    },

    // Đăng nhập và lưu thông tin vào LocalStorage
    login: async (credentials) => {
        const response = await API.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;