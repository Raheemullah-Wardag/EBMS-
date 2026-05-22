import axiosInstance from './axiosInstance';
 
export const getAllOrders       = ()         => axiosInstance.get('/Order');
export const getMyOrders        = ()         => axiosInstance.get('/Order/my');
export const getOrderByID       = (id)       => axiosInstance.get(`/Order/${id}`);
export const placeStockOrder    = (data)     => axiosInstance.post('/Order/stock', data);
export const placeCustomOrder   = (data)     => axiosInstance.post('/Order/custom', data);
export const updateOrderStatus  = (id, data) => axiosInstance.put(`/Order/${id}/status`, data);