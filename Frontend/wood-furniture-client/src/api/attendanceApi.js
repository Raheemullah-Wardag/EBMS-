import axiosInstance from './axiosInstance';
 
export const getAllAttendance        = ()     => axiosInstance.get('/Attendance');
export const getAttendanceByEmployee = (id)   => axiosInstance.get(`/Attendance/employee/${id}`);
export const markAttendance          = (data) => axiosInstance.post('/Attendance', data);