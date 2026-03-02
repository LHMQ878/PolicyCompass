import api from './api';

export const listMessages = (params?: Record<string, unknown>) => api.get('/messages', { params });
export const markAllRead = () => api.post('/messages/read-all');
