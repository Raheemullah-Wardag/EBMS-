import axiosInstance from './axiosInstance';
 
export const getPaymentsByOrder = (orderId) => axiosInstance.get(`/Payment/order/${orderId}`);
export const processPayment     = (data)    => axiosInstance.post('/Payment', data);