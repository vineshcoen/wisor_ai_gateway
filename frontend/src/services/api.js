import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can intercept requests or responses here if needed in the future
api.interceptors.request.use(
  (config) => {
    // Add auth tokens, etc., if available
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handler placeholder
    return Promise.reject(error);
  }
);

export default api;
