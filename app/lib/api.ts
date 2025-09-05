import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
  
  verifyEmail: (token: string) =>
    api.get(`/users/verify/${token}`),
  
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
  
  updateTransaction: (id: number, data: {
    category_id?: string;
    amount?: number;
    description?: string;
    date?: string;
  }) => api.put(`/transactions/${id}`, data),
  
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
