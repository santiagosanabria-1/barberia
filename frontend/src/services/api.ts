import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return 'http://localhost:5000/api';
};

export const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {

  const token =
    useAuthStore.getState().token ||
    localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      console.error('Unauthorized request');
    }

    return Promise.reject(error);
  }
);

export const settingsApi = {
  get: async () => {
    const { data } = await api.get('/settings');
    return data;
  },

  update: async (payload: any) => {
    const { data } = await api.put('/settings', payload);
    return data;
  },
};
