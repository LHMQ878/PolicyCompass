import api from './api';

export const getMyEnterprise = () => api.get('/enterprises/mine');
export const getEnterprise = (id: string) => api.get(`/enterprises/${id}`);
export const updateEnterprise = (id: string, data: Record<string, unknown>) => api.put(`/enterprises/${id}`, data);
