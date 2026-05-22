import axiosInstance from './axiosInstance';
 
export const getAllBatches     = ()         => axiosInstance.get('/Production');
export const createBatch       = (data)     => axiosInstance.post('/Production', data);
export const updateBatchStatus = (id, data) => axiosInstance.put(`/Production/${id}/status`, data);