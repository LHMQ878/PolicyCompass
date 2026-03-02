import api from './api';

export const listMaterials = (params?: Record<string, unknown>) => api.get('/materials', { params });
export const uploadMaterial = (formData: FormData) => api.post('/materials/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMaterial = (id: string) => api.delete(`/materials/${id}`);
