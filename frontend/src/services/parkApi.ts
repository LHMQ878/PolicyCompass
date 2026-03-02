import api from './api';

export const getMyPark = () => api.get('/parks/mine');
export const getPark = (id: string) => api.get(`/parks/${id}`);
export const updatePark = (id: string, data: Record<string, unknown>) => api.put(`/parks/${id}`, data);
export const publishParkPolicy = (parkId: string, data: FormData) => api.post(`/parks/${parkId}/policies`, data);
export const getPolicyMatches = (parkId: string) => api.get(`/parks/${parkId}/policy-matches`);
export const pushPolicy = (parkId: string, data: Record<string, unknown>) => api.post(`/parks/${parkId}/push-policy`, data);
