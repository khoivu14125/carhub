import API from './api';

const carService = {
  // Lấy danh sách xe đã duyệt (Buyer xem)
  getCars: async (filters = {}) => {
    const { keyword, brand, maxPrice } = filters;

    const response = await API.get('/cars', {
      params: { keyword, brand, maxPrice }
    });

    return response.data;
  },

  // Lấy danh sách xe chờ duyệt (Admin xem)
  getPendingCars: async () => {
    const response = await API.get('/cars/pending');
    return response.data;
  },

  // Xem chi tiết một chiếc xe
  getCarById: async (id) => {
    const response = await API.get(`/cars/${id}`);
    return response.data;
  },

  // Người bán đăng tin mới
  postCar: async (carFormData) => {
    const response = await API.post('/cars/post-car', carFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Admin duyệt hoặc từ chối xe
  approveCar: async (id, status) => {
    const response = await API.put(`/cars/approve/${id}`, { status });
    return response.data;
  },

  // Seller lấy 1 bài đăng của mình để sửa
getSellerCarById: async (id) => {
  const response = await API.get(`/cars/seller/${id}`);
  return response.data;
},

// Seller cập nhật bài đăng
updateSellerCar: async (id, carFormData) => {
  const response = await API.put(`/cars/seller/${id}`, carFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
},
};

export default carService;