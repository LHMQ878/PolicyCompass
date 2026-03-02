import api from './api';

export const listApplications = (params?: Record<string, unknown>) => api.get('/applications', { params });
export const createApplication = (data: { entity_id: string; entity_type: string; policy_id: string }) => api.post('/applications', data);
export const getApplication = (id: string) => api.get(`/applications/${id}`);
export const submitFeedback = (id: string, data: Record<string, unknown>) => api.post(`/applications/${id}/feedback`, data);
