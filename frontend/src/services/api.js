import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // chỉnh nếu BE khác port
});

// Thêm token vào header nếu có
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const requestTransfer = (to_user_id, amount) =>
  axios.post('/api/transaction/request-transfer', { to_user_id, amount });

export const confirmTransfer = (to_user_id, amount, otp) =>
  axios.post('/api/transaction/transfer', { to_user_id, amount, otp });

export const wallet = {
  getBalance: () => api.get('/wallet/balance'),
  deposit: (amount) => api.post('/wallet/deposit', { amount }),
  transfer: (data) => api.post('/wallet/transfer', data),
  getTransactions: (queryParams = '') => api.get(`/transaction/search?${queryParams}`),
};

export default api;
