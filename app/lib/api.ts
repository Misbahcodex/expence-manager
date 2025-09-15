import axios from 'axios';

// ✅ Correct API base URL with /api
const API_BASE_URL = '/api/proxy';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Keep this false for now
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await api.post('/users/refresh-token');
        
        if (response.data.token) {
          // Update token in localStorage
          localStorage.setItem('token', response.data.token);
          
          // Update Authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors or if token refresh failed
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/users/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/users/login', data),

  logout: () => api.post('/users/logout'),
  
  refreshToken: () => api.post('/users/refresh-token'),

  verifyEmail: (token: string) => api.get(`/users/verify/${token}`),

  forgotPassword: (data: { email: string }) =>
    api.post('/users/forgot-password', data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/users/reset-password', data),
};

// Transaction API
export const transactionAPI = {
  getTransactions: () => api.get('/transactions'),

  createTransaction: (data: {
    category_id: string;
    amount: number;
    description?: string;
    date?: string;
  }) => api.post('/transactions', data),

  updateTransaction: (
    id: number,
    data: {
      category_id?: string;
      amount?: number;
      description?: string;
      date?: string;
    }
  ) => api.put(`/transactions/${id}`, data),

  deleteTransaction: (id: number) => api.delete(`/transactions/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};

// Category API
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
};