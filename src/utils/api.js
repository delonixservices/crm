// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hgjh-leadserversam.qbthl0.easypanel.host',
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;