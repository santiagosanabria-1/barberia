import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<void>;
  loadProfile: () => Promise<void>;
  logout: (remote?: boolean) => Promise<void> | void;
}

export const useAuthStore = create<AuthState>()(persist((set, get) => ({
  user: null,
  token: null,
  hydrated: false,
  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data.user, token: data.token });
    } catch (error) {
      if (axios.isAxiosError(error)) throw new Error(error.response?.data?.message || error.message);
      throw error;
    }
  },
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    set({ user: data.user, token: data.token });
  },
  loadProfile: async () => {
    if (!get().token) return;
    const { data } = await api.get('/auth/profile');
    set({ user: data });
  },
  logout: async (remote = true) => {
    if (remote) await api.post('/auth/logout').catch(() => undefined);
    set({ user: null, token: null });
  }
}), { name: 'black-crown-session' }));
