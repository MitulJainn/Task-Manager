import axios from 'axios';

// Create Axios client with base URL pointing to /api (proxied via Vite in dev or relative in prod)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred';
    let errors = [];

    if (error.response && error.response.data) {
      message = error.response.data.message || message;
      errors = error.response.data.errors || [];
    } else if (error.request) {
      message = 'Unable to connect to the TaskFlow server. Please check your backend.';
    } else {
      message = error.message;
    }

    return Promise.reject({
      message,
      errors,
      status: error.response?.status,
    });
  }
);

export const taskApi = {
  // Get tasks with optional query filters
  getTasks: (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'all') {
        cleanParams[key] = params[key];
      }
    });
    return apiClient.get('/tasks', { params: cleanParams });
  },

  // Get dynamic dashboard stats
  getStats: () => apiClient.get('/tasks/stats'),

  // Get task by ID
  getTaskById: (id) => apiClient.get(`/tasks/${id}`),

  // Create new task
  createTask: (data) => apiClient.post('/tasks', data),

  // Update existing task
  updateTask: (id, data) => apiClient.put(`/tasks/${id}`, data),

  // Toggle or patch task status
  updateStatus: (id, status) => apiClient.patch(`/tasks/${id}/status`, { status }),

  // Delete a task
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),

  // Check backend server health
  checkHealth: () => apiClient.get('/health'),
};

export default taskApi;
