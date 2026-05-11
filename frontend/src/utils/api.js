import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Complaint APIs
export const createComplaint = (formData) => api.post('/complaints', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getMyComplaints = () => api.get('/complaints/my-complaints');
export const getComplaint = (id) => api.get(`/complaints/${id}`);

// Admin APIs
export const getAllComplaints = (params) => api.get('/admin/complaints', { params });
export const updateComplaintStatus = (id, status) => api.patch(`/admin/complaints/${id}/status`, { status });
export const uploadAfterImage = (id, formData) => api.patch(`/admin/complaints/${id}/after-image`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAnalytics = () => api.get('/admin/analytics');
