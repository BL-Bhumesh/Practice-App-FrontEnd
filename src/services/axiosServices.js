// src/services/axiosServices.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://52.66.201.120:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optionally: add interceptors (for auth tokens)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
