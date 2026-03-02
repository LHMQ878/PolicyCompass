import api from './api';

export const sendMessage = (message: string, sessionId?: string) =>
  api.post('/chat/message', { message, session_id: sessionId });

export const listSessions = () => api.get('/chat/sessions');
