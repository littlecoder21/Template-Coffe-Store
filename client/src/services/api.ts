import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add language to query params if not already present
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    if (config.params && !config.params.language) {
      config.params.language = currentLang;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Menu API
export const menuAPI = {
  getAll: (params?: any) => api.get('/menu', { params }),
  getByCategory: (category: string, params?: any) => 
    api.get(`/menu/category/${category}`, { params }),
  getDiscounted: () => api.get('/menu/discounted'),
  getFeatured: () => api.get('/menu/featured'),
  getById: (id: string) => api.get(`/menu/${id}`),
  getCategories: (params?: any) => api.get('/menu/categories/all', { params }),
};

// Gallery API
export const galleryAPI = {
  getAll: (params?: any) => api.get('/gallery', { params }),
  getByCategory: (category: string, params?: any) => 
    api.get(`/gallery/category/${category}`, { params }),
  getById: (id: string) => api.get(`/gallery/${id}`),
  getCategories: (params?: any) => api.get('/gallery/categories/all', { params }),
};

// Search API
export const searchAPI = {
  search: (params?: any) => api.get('/search', { params }),
  advancedSearch: (params?: any) => api.get('/search/advanced', { params }),
  getSuggestions: (params?: any) => api.get('/search/suggestions', { params }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;