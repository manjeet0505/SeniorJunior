'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchProfile, patchUser as patchUserApi, sendConnectionRequest } from '@/lib/profileApi';

const cache = new Map();
const CACHE_TTL_MS = 30_000;

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value) {
  cache.set(key, { value, ts: Date.now() });
}

export function useProfile(userId) {
  const [profile, setProfile] = useState(() => (userId ? getCache(userId) : null));
  const [loading, setLoading] = useState(!profile);
  const [error, setError] = useState('');

  const abortRef = useRef(null);

  const load = useCallback(async ({ force = false } = {}) => {
    if (!userId) return;

    const cached = force ? null : getCache(userId);
    if (cached) {
      setProfile(cached);
      setLoading(false);
      setError('');
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError('');

    try {
      const p = await fetchProfile(userId, { signal: controller.signal });
      setProfile(p);
      setCache(userId, p);
    } catch (e) {
      if (e?.name === 'CanceledError' || e?.name === 'AbortError') return;
      setError(e?.response?.data?.error || e?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [load]);

  const refresh = useCallback(() => load({ force: true }), [load]);

  const updateUser = useCallback(async (patch) => {
    if (!profile?.user?.id) return { ok: false };

    setError('');

    const prev = profile;
    const next = {
      ...profile,
      user: {
        ...profile.user,
        ...patch
      }
    };

    setProfile(next);
    setCache(userId, next);

    try {
      await patchUserApi(profile.user.id, patch);
      return { ok: true };
    } catch (e) {
      setProfile(prev);
      setCache(userId, prev);
      setError(e?.response?.data?.error || e?.message || 'Failed to update profile');
      return { ok: false };
    }
  }, [profile, userId]);

  const connect = useCallback(async () => {
    if (!profile?.user?.id) return { ok: false };

    setError('');
    try {
      await sendConnectionRequest(profile.user.id);
      await refresh();
      return { ok: true };
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to send connection request');
      return { ok: false };
    }
  }, [profile?.user?.id, refresh]);

  const derived = useMemo(() => {
    const viewer = profile?.viewer;
    const user = profile?.user;
    const stats = profile?.stats;
    return { viewer, user, stats };
  }, [profile]);

  return {
    profile,
    ...derived,
    loading,
    error,
    refresh,
    updateUser,
    connect
  };
}
