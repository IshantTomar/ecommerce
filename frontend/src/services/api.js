import axios from 'axios';
import { getAccessToken, clearAccessToken, setAccessToken } from '../utils/tokenStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ← sends httpOnly cookie automatically
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      if (window.location.pathname !== '/login') {
        clearAccessToken();
        window.location.href = '/login?reason=compromised';
      }
      return Promise.reject(error);
    }

    // if 401 and not already retried and not the refresh route itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        // refresh failed → session expired → kick to login
        if (window.location.pathname !== '/login') {
          clearAccessToken();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
