import api from './api';

export const getMyTalent = () => api.get('/talents/mine');
export const getTalent = (id: string) => api.get(`/talents/${id}`);
export const updateTalent = (id: string, data: Record<string, unknown>) => api.put(`/talents/${id}`, data);
