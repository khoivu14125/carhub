import API from './api';

const viewingRequestService = {
  createRequest: async (data) => {
    const response = await API.post('/viewing-requests', data);
    return response.data;
  },

  getSellerRequests: async () => {
    const response = await API.get('/viewing-requests/seller/requests');
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await API.put(`/viewing-requests/seller/requests/${id}`, { status });
    return response.data;
  }
};

export default viewingRequestService;