import api from './api';

export const getOpportunities = (entityId: string) => api.get(`/collaboration/opportunities/${entityId}`);
export const sendConnectRequest = (data: Record<string, unknown>) => api.post('/collaboration/connect', data);
export const listRequests = () => api.get('/collaboration/requests');
