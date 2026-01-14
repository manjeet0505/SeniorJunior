import { apiClient } from '@/utils/errorUtils';

export async function fetchResources(params = {}, options = {}) {
  const res = await apiClient.get('/api/resources', { params, signal: options.signal });
  return res.data;
}

export async function fetchRecommendedResources(params = {}, options = {}) {
  const res = await apiClient.get('/api/resources/recommended', { params, signal: options.signal });
  return res.data;
}

export async function toggleSaveResource(resourceId, desiredSaved, options = {}) {
  const res = await apiClient.post(
    `/api/resources/${resourceId}/save`,
    typeof desiredSaved === 'boolean' ? { saved: desiredSaved } : {},
    { signal: options.signal }
  );
  return res.data;
}

export async function trackResourceView(resourceId, options = {}) {
  const res = await apiClient.post(`/api/resources/${resourceId}/view`, {}, { signal: options.signal });
  return res.data;
}

export async function toggleRecommendForJuniors(resourceId, options = {}) {
  const res = await apiClient.post(`/api/resources/${resourceId}/recommend`, {}, { signal: options.signal });
  return res.data;
}
