import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/admin/login', credentials),
  
  logout: () => api.post('/admin/logout'),
  
  getProfile: () => api.get('/admin/profile'),
  
  updateProfile: (data: { firstName?: string; lastName?: string; email?: string }) =>
    api.put('/admin/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/admin/change-password', data),
  
  getAdmins: () => api.get('/admin/admins'),
  
  createAdmin: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => api.post('/admin/admins', data),
  
  updateAdmin: (id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
  }) => api.put(`/admin/admins/${id}`, data),
  
  deleteAdmin: (id: string) => api.delete(`/admin/admins/${id}`),
};

// Menu API
export const menuAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get('/admin/menu', { params }),
  
  getById: (id: string) => api.get(`/admin/menu/${id}`),
  
  create: (data: any) => api.post('/admin/menu', data),
  
  update: (id: string, data: any) => api.put(`/admin/menu/${id}`, data),
  
  delete: (id: string) => api.delete(`/admin/menu/${id}`),
  
  bulkOperation: (data: { action: string; ids: string[]; updates?: any }) =>
    api.post('/admin/menu/bulk', data),
  
  getStats: () => api.get('/admin/menu/stats/overview'),
  
  getCategories: () => api.get('/admin/menu/categories/all'),
};

// Gallery API
export const galleryAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get('/admin/gallery', { params }),
  
  getById: (id: string) => api.get(`/admin/gallery/${id}`),
  
  create: (data: any) => api.post('/admin/gallery', data),
  
  update: (id: string, data: any) => api.put(`/admin/gallery/${id}`, data),
  
  delete: (id: string) => api.delete(`/admin/gallery/${id}`),
  
  bulkOperation: (data: { action: string; ids: string[]; updates?: any }) =>
    api.post('/admin/gallery/bulk', data),
  
  reorder: (data: { items: { id: string }[] }) =>
    api.post('/admin/gallery/reorder', data),
  
  getStats: () => api.get('/admin/gallery/stats/overview'),
  
  getCategories: () => api.get('/admin/gallery/categories/all'),
};

export default api;