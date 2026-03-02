import api from './api';

export const login = (phone: string, password: string) =>
  api.post('/auth/login', { phone, password });

export const register = (phone: string, password: string, role: string) =>
  api.post('/auth/register', { phone, password, role });

export const forgotPassword = (phone: string, code: string, newPassword: string) =>
  api.post('/auth/forgot-password', { phone, code, new_password: newPassword });
