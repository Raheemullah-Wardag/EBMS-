import axiosInstance from './axiosInstance';

export const getAllRawMaterials = () => axiosInstance.get('/rawmaterials');
