import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL;
  if (!url || url.trim() === '') {
    return '/api';
  }
  url = url.trim();
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  if (!url.endsWith('/api') && url.startsWith('http')) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto-attach JWT Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Error parsing auth token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login failure attempts
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        // If expired or unauthorized on private endpoint
        console.warn('Session expired or unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
