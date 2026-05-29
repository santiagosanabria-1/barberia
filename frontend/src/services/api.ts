import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const api = axios.create({ baseURL: getApiUrl(), withCredentials: true });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) useAuthStore.getState().logout(false);
  return Promise.reject(error);
});
export const settingsApi = {
  get: async () => {
    const { data } = await api.get('/settings');
    return data;
  },

  update: async (settings: any) => {
    const { data } = await api.put('/settings', settings);
    return data;
  }
};
