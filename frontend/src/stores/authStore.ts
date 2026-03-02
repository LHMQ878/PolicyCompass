import { create } from 'zustand';
import type { User } from '@/types';

const loadUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user_info');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('access_token'),
  user: loadUser(),
  isAuthenticated: !!localStorage.getItem('access_token'),
  login: (token, user) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_info', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    set({ token: null, user: null, isAuthenticated: false });
  },
  setUser: (user) => {
    localStorage.setItem('user_info', JSON.stringify(user));
    set({ user });
  },
}));
