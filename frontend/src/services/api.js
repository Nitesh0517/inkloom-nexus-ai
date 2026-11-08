import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inkloom_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userRole = localStorage.getItem('inkloom_user_role');
    if (userRole) {
      config.headers['x-user-role'] = userRole;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-clear in demo mode
      console.warn('Unauthorized request or session expired');
    }
    return Promise.reject(error);
  }
);

// Endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  demoLogin: (role) => api.post('/auth/demo-login', { role }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const brandAPI = {
  getAll: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
  uploadGuideline: (id, formData) =>
    api.post(`/brands/${id}/guidelines`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const reviewAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  updateFinding: (reviewId, findingId, data) =>
    api.patch(`/reviews/${reviewId}/findings/${findingId}`, data),
};

export const approvalAPI = {
  getAll: (params) => api.get('/approvals', { params }),
  create: (data) => api.post('/approvals', data),
};

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getTrends: (params) => api.get('/analytics/trends', { params }),
};

export const aiAPI = {
  getStatus: () => api.get('/ai/status'),
  analyze: (data) => api.post('/ai/analyze', data),
  suggest: (data) => api.post('/ai/suggest', data),
};

export default api;
