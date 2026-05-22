import axiosInstance from './axiosInstance';
 
export const getAllEmployees  = ()         => axiosInstance.get('/Employee');
export const getEmployeeByID = (id)       => axiosInstance.get(`/Employee/${id}`);
export const createEmployee  = (data)     => axiosInstance.post('/Employee', data);
export const updateEmployee  = (id, data) => axiosInstance.put(`/Employee/${id}`, data);
 
 