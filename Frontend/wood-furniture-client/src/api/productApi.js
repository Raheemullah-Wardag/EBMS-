import axiosInstance from './axiosInstance';
 
export const getAllProducts     = ()         => axiosInstance.get('/Product');
export const getProductByID     = (id)       => axiosInstance.get(`/Product/${id}`);
export const createProduct      = (data)     => axiosInstance.post('/Product', data);
export const updateProduct      = (id, data) => axiosInstance.put(`/Product/${id}`, data);
export const deleteProduct      = (id)       => axiosInstance.delete(`/Product/${id}`);
export const getProductImages   = (id)       => axiosInstance.get(`/Product/${id}/images`);
export const uploadProductImage = (id, formData) =>
    axiosInstance.post(`/Product/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
export const deleteProductImage = (imageId) =>
    axiosInstance.delete(`/Product/images/${imageId}`);