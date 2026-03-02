import api from './api';

export const calculateMatch = (entityType: string, entityId: string, policyIds?: string[]) =>
  api.post('/matching/calculate', { entity_type: entityType, entity_id: entityId, policy_ids: policyIds });

export const getMatchResults = (entityId: string) =>
  api.get(`/matching/result/${entityId}`);

export const getGapAnalysis = (entityId: string, policyId: string) =>
  api.get(`/matching/gaps/${entityId}/${policyId}`);

export const getGrowthPath = (entityId: string) =>
  api.get(`/matching/growth-path/${entityId}`);
