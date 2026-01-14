import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchRecommendedResources,
  fetchResources,
  toggleRecommendForJuniors,
  toggleSaveResource,
  trackResourceView,
} from '@/lib/resourcesApi';

const CACHE_TTL_MS = 30_000;

const listCache = new Map();
const recommendedCache = new Map();

function stableKey(obj) {
  if (!obj) return '';
  const keys = Object.keys(obj).sort();
  const ordered = {};
  for (const k of keys) ordered[k] = obj[k];
  return JSON.stringify(ordered);
}

function upsertById(items, id, patch) {
  return items.map((x) => (x.id === id ? { ...x, ...patch } : x));
}

export function useResources({ listParams, recommendedParams } = {}) {
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [recommended, setRecommended] = useState([]);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [error, setError] = useState(null);

  const [reloadToken, setReloadToken] = useState(0);

  const listAbortRef = useRef(null);
  const recAbortRef = useRef(null);

  const listKey = useMemo(() => `${stableKey(listParams)}|${reloadToken}`, [listParams, reloadToken]);
  const recKey = useMemo(() => `${stableKey(recommendedParams)}|${reloadToken}`, [recommendedParams, reloadToken]);

  useEffect(() => {
    const cached = listCache.get(listKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setResources(cached.data.resources || []);
      setPagination(cached.data.pagination || null);
      setLoadingList(false);
      return;
    }

    setLoadingList(true);
    setError(null);

    if (listAbortRef.current) listAbortRef.current.abort();
    const controller = new AbortController();
    listAbortRef.current = controller;

    fetchResources(listParams || {}, { signal: controller.signal })
      .then((data) => {
        listCache.set(listKey, { ts: Date.now(), data });
        setResources(data.resources || []);
        setPagination(data.pagination || null);
      })
      .catch((e) => {
        if (e?.name === 'CanceledError' || e?.name === 'AbortError') return;
        setError(e);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingList(false);
      });

    return () => controller.abort();
  }, [listKey, listParams]);

  useEffect(() => {
    const cached = recommendedCache.get(recKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setRecommended(cached.data.recommendations || []);
      setLoadingRecommended(false);
      return;
    }

    setLoadingRecommended(true);
    setError(null);

    if (recAbortRef.current) recAbortRef.current.abort();
    const controller = new AbortController();
    recAbortRef.current = controller;

    fetchRecommendedResources(recommendedParams || {}, { signal: controller.signal })
      .then((data) => {
        recommendedCache.set(recKey, { ts: Date.now(), data });
        setRecommended(data.recommendations || []);
      })
      .catch((e) => {
        if (e?.name === 'CanceledError' || e?.name === 'AbortError') return;
        setError(e);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingRecommended(false);
      });

    return () => controller.abort();
  }, [recKey, recommendedParams]);

  const mutateLocal = useCallback((id, patch) => {
    setResources((prev) => upsertById(prev, id, patch));
    setRecommended((prev) => upsertById(prev, id, patch));
  }, []);

  const toggleSave = useCallback(
    async (id, desired) => {
      const current = [...resources, ...recommended].find((r) => r.id === id);
      const prevSaved = Boolean(current?.isSaved);
      const nextSaved = typeof desired === 'boolean' ? desired : !prevSaved;

      mutateLocal(id, { isSaved: nextSaved });

      try {
        const res = await toggleSaveResource(id, nextSaved);
        mutateLocal(id, { isSaved: Boolean(res.saved) });
        return res;
      } catch (e) {
        mutateLocal(id, { isSaved: prevSaved });
        throw e;
      }
    },
    [mutateLocal, recommended, resources]
  );

  const trackView = useCallback(
    async (id) => {
      mutateLocal(id, { userViewCount: (([...resources, ...recommended].find((r) => r.id === id)?.userViewCount) || 0) + 1 });
      try {
        return await trackResourceView(id);
      } catch (e) {
        throw e;
      }
    },
    [mutateLocal, recommended, resources]
  );

  const toggleRecommend = useCallback(
    async (id) => {
      const current = [...resources, ...recommended].find((r) => r.id === id);
      const prevCount = Number(current?.recommendedForJuniorsCount || 0);
      const prevMine = Boolean(current?.isRecommendedForJuniorsByMe);
      const nextMine = !prevMine;
      const nextCount = Math.max(0, prevCount + (nextMine ? 1 : -1));

      mutateLocal(id, { recommendedForJuniorsCount: nextCount, isRecommendedForJuniorsByMe: nextMine });

      try {
        const res = await toggleRecommendForJuniors(id);
        mutateLocal(id, {
          recommendedForJuniorsCount: Number(res.recommendedForJuniorsCount || 0),
          isRecommendedForJuniorsByMe: Boolean(res.recommended),
        });
        return res;
      } catch (e) {
        mutateLocal(id, { recommendedForJuniorsCount: prevCount, isRecommendedForJuniorsByMe: prevMine });
        throw e;
      }
    },
    [mutateLocal, recommended, resources]
  );

  const refresh = useCallback(() => {
    listCache.delete(listKey);
    recommendedCache.delete(recKey);
    setLoadingList(true);
    setLoadingRecommended(true);
    setReloadToken((x) => x + 1);
  }, [listKey, recKey]);

  return {
    resources,
    pagination,
    recommended,
    loading: loadingList || loadingRecommended,
    loadingList,
    loadingRecommended,
    error,
    toggleSave,
    trackView,
    toggleRecommend,
    refresh,
  };
}
