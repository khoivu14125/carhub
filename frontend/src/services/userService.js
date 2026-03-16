import API from './api';

const userService = {
  getProfile: async () => {
    const response = await API.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await API.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await API.put('/users/change-password', data);
    return response.data;
  }
};

export default userService;