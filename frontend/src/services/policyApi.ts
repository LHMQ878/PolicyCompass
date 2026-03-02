import api from './api';

export const listPolicies = (params?: Record<string, unknown>) =>
  api.get('/policies', { params });

export const getPolicy = (id: string) =>
  api.get(`/policies/${id}`);

export const favoritePolicy = (id: string) =>
  api.post(`/policies/${id}/favorite`);

export const unfavoritePolicy = (id: string) =>
  api.delete(`/policies/${id}/favorite`);
