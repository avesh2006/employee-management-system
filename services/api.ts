import axios from 'axios';
import { User, UserRole } from '../types';

// Use environment variable or default to localhost
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ems_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Redirect to login or clear storage only if strictly required
      // localStorage.removeItem('ems_token');
      // localStorage.removeItem('ems_user');
      // window.location.href = '#/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, role: string) => {
    return api.post('/auth/login', { email, role });
  },
  register: async (userData: Partial<User>) => {
    return api.post('/auth/register', userData);
  },
  logout: () => {
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
  }
};

export const userService = {
  updateProfile: async (data: Partial<User>) => api.put('/user/profile', data),
};

export const dashboardService = {
  getStats: async () => api.get('/dashboard/stats'),
  getAttendanceTrends: async () => api.get('/dashboard/attendance-trends')
};

export const attendanceService = {
  checkIn: async (data: any) => api.post('/attendance/check-in', data),
  checkOut: async (data: any) => api.post('/attendance/check-out', data),
  getHistory: async () => api.get('/attendance/history'),
};

export const leaveService = {
  getLeaves: async () => api.get('/leave'),
  requestLeave: async (data: any) => api.post('/leave/request', data),
  cancelLeave: async (id: string) => api.delete(`/leave/${id}`),
};

export const salaryService = {
  getHistory: async () => api.get('/salary/history'),
  getBreakdown: async () => api.get('/salary/breakdown'),
};

export const auditService = {
  getLogs: async (filters?: any) => api.get('/audit-logs', { params: filters }),
};

export default api;