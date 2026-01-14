'use client';

import { apiClient } from '@/utils/errorUtils';

export async function fetchProfile(userId, { signal } = {}) {
  const res = await apiClient.get(`/api/profile/${userId}`, { signal });
  return res.data?.profile;
}

export async function patchUser(userId, patch, { signal } = {}) {
  const res = await apiClient.patch(`/api/users/${userId}`, patch, { signal });
  return res.data?.user;
}

export async function sendConnectionRequest(recipientId, { signal } = {}) {
  const res = await apiClient.post('/api/connections', { recipientId }, { signal });
  return res.data;
}
