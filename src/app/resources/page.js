"use client";
import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResources } from '@/hooks/useResources';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

const CATEGORIES = ['Frontend', 'Backend', 'DSA', 'AI'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const TYPES = ['Docs', 'Course', 'Practice', 'Video'];

const LEARNING_PATHS = [
  {
    key: 'Frontend',
    title: 'Frontend Path',
    subtitle: 'React, UI engineering, and modern web patterns.',
    categories: ['Frontend'],
    difficulties: ['Beginner', 'Intermediate'],
  },
  {
    key: 'Backend',
    title: 'Backend Path',
    subtitle: 'APIs, databases, auth, and scaling basics.',
    categories: ['Backend'],
    difficulties: ['Beginner', 'Intermediate'],
  },
  {
    key: 'DSA',
    title: 'DSA Path',
    subtitle: 'Interviews, problem solving, and fundamentals.',
    categories: ['DSA'],
    difficulties: ['Beginner', 'Intermediate'],
  },
  {
    key: 'AI',
    title: 'AI Path',
    subtitle: 'Intro ML, prompt engineering, and applied AI.',
    categories: ['AI'],
    difficulties: ['Beginner', 'Intermediate'],
  },
];

const Pill = memo(function Pill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'px-3 py-1.5 rounded-full text-sm bg-white/15 border border-white/20 text-white'
          : 'px-3 py-1.5 rounded-full text-sm bg-black/20 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
      }
    >
      {children}
    </button>
  );
});

const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="h-5 w-2/3 bg-white/10 rounded mb-3" />
      <div className="h-4 w-full bg-white/10 rounded mb-2" />
      <div className="h-4 w-5/6 bg-white/10 rounded mb-5" />
      <div className="flex gap-2">
        <div className="h-9 w-24 bg-white/10 rounded-lg" />
        <div className="h-9 w-24 bg-white/10 rounded-lg" />
        <div className="h-9 w-28 bg-white/10 rounded-lg" />
      </div>
    </div>
  );
});

const ResourceCard = memo(function ResourceCard({ resource, role, onSave, onExplore, onSummary, onRecommend }) {
  const difficultyClass =
    resource.difficulty === 'Beginner'
      ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/20'
      : resource.difficulty === 'Intermediate'
        ? 'bg-blue-500/15 text-blue-200 border-blue-500/20'
        : 'bg-purple-500/15 text-purple-200 border-purple-500/20';

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white truncate">{resource.title}</h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{resource.description || '—'}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${difficultyClass}`}>{resource.difficulty}</span>
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">{resource.type}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">{resource.category}</span>
        {resource.userViewCount ? (
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">Viewed {resource.userViewCount}</span>
        ) : null}
        {role === 'senior' ? (
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">Juniors benefited {resource.juniorBenefitCount || 0}</span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 mt-5">
        <button
          type="button"
          onClick={onExplore}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-semibold"
        >
          Explore
        </button>

        <button
          type="button"
          onClick={onSave}
          className={
            resource.isSaved
              ? 'px-4 py-2 rounded-lg bg-white/15 border border-white/20 text-white text-sm font-semibold'
              : 'px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 text-sm font-semibold'
          }
        >
          {resource.isSaved ? 'Saved' : 'Save'}
        </button>

        <button
          type="button"
          onClick={onSummary}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 text-sm font-semibold"
        >
          AI Summary
        </button>

        {role === 'senior' ? (
          <button
            type="button"
            onClick={onRecommend}
            className={
              resource.isRecommendedForJuniorsByMe
                ? 'px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-200 text-sm font-semibold'
                : 'px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 text-sm font-semibold'
            }
          >
            {resource.isRecommendedForJuniorsByMe ? `Recommended (${resource.recommendedForJuniorsCount || 0})` : `Recommend (${resource.recommendedForJuniorsCount || 0})`}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
});

function getUserFromStorage() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ResourcesPage() {
  const [user, setUser] = useState(null);

  const [q, setQ] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryResource, setSummaryResource] = useState(null);

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const role = user?.role || 'junior';

  const listParams = useMemo(
    () => ({
      q: q || undefined,
      categories: selectedCategories.length ? selectedCategories.join(',') : undefined,
      difficulties: selectedDifficulties.length ? selectedDifficulties.join(',') : undefined,
      types: selectedTypes.length ? selectedTypes.join(',') : undefined,
      savedOnly: savedOnly ? 'true' : undefined,
      limit: 24,
      page: 1,
    }),
    [q, savedOnly, selectedCategories, selectedDifficulties, selectedTypes]
  );

  const {
    resources,
    recommended,
    loadingList,
    loadingRecommended,
    error,
    toggleSave,
    trackView,
    toggleRecommend,
    refresh,
  } = useResources({ listParams, recommendedParams: { limit: 8 } });

  const toggleFromList = useCallback((prev, value) => {
    return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
  }, []);

  const onOpenSummary = useCallback((r) => {
    setSummaryResource(r);
    setSummaryOpen(true);
  }, []);

  const onCloseSummary = useCallback(() => {
    setSummaryOpen(false);
    setSummaryResource(null);
  }, []);

  const onExplore = useCallback(
    async (r) => {
      try {
        await trackView(r.id);
      } catch {
      }
      window.open(r.url, '_blank', 'noopener,noreferrer');
    },
    [trackView]
  );

  const recommendedTitle = role === 'senior' ? 'AI Recommended (Senior)' : 'AI Recommended For You';
  const recommendedSubtitle = role === 'senior'
    ? 'Advanced picks based on your skills and activity.'
    : 'Start here. Tailored to what you are learning right now.';

  const showLearningPaths = role === 'junior' && !savedOnly;

  return (
    <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold">Resources</h1>
              <p className="text-lg text-gray-400 mt-2 max-w-2xl">
                Personalized learning resources for your role, skills, and activity.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refresh()}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 text-sm font-semibold"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={() => setSavedOnly((s) => !s)}
                className={
                  savedOnly
                    ? 'px-4 py-2 rounded-lg bg-white/15 border border-white/20 text-white text-sm font-semibold'
                    : 'px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 text-sm font-semibold'
                }
              >
                {savedOnly ? 'Saved Only' : 'All'}
              </button>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-6">
            <ErrorDisplay error={error} />
          </div>
        ) : null}

        <section className="mb-10">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex-1">
                <label className="text-sm text-gray-300">Search</label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search resources, e.g. React hooks, JWT, system design"
                  className="mt-2 w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-300 mr-2">Category</span>
                  {CATEGORIES.map((c) => (
                    <Pill
                      key={c}
                      active={selectedCategories.includes(c)}
                      onClick={() => setSelectedCategories((prev) => toggleFromList(prev, c))}
                    >
                      {c}
                    </Pill>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-300 mr-2">Difficulty</span>
                  {DIFFICULTIES.map((d) => (
                    <Pill
                      key={d}
                      active={selectedDifficulties.includes(d)}
                      onClick={() => setSelectedDifficulties((prev) => toggleFromList(prev, d))}
                    >
                      {d}
                    </Pill>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-300 mr-2">Type</span>
                  {TYPES.map((t) => (
                    <Pill
                      key={t}
                      active={selectedTypes.includes(t)}
                      onClick={() => setSelectedTypes((prev) => toggleFromList(prev, t))}
                    >
                      {t}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-extrabold">Browse</h2>
              <p className="text-gray-400">
                {role === 'senior'
                  ? 'Advanced resources and senior-curated recommendations for juniors.'
                  : 'Beginner-friendly resources with save & view tracking.'}
              </p>
            </div>
          </div>

          {loadingList ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : resources.length ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  role={role}
                  onSave={() => toggleSave(r.id)}
                  onExplore={() => onExplore(r)}
                  onSummary={() => onOpenSummary(r)}
                  onRecommend={() => toggleRecommend(r.id)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-gray-300">
              No resources match your filters. Try clearing filters or searching a broader term.
            </div>
          )}
        </section>

        {showLearningPaths ? (
          <section className="mb-10">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-extrabold">Start Here</h2>
                <p className="text-gray-400">Guided learning paths for beginners. Pick a track and build momentum.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {LEARNING_PATHS.map((p) => (
                <motion.button
                  key={p.key}
                  type="button"
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  onClick={() => {
                    setSelectedCategories(p.categories);
                    setSelectedDifficulties(p.difficulties);
                    setSavedOnly(false);
                  }}
                  className="text-left bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:border-purple-500/40"
                >
                  <div className="text-white font-bold">{p.title}</div>
                  <div className="text-sm text-gray-400 mt-1">{p.subtitle}</div>
                  <div className="mt-3 text-xs text-purple-200/90">Open path</div>
                </motion.button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-10">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-extrabold">{recommendedTitle}</h2>
              <p className="text-gray-400">{recommendedSubtitle}</p>
            </div>
          </div>

          {loadingRecommended ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : recommended.length ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((r) => (
                <div key={r.id} className="space-y-2">
                  <div className="text-xs text-purple-200/90 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2">
                    {r.explanation || 'Recommended based on your activity.'}
                  </div>
                  <ResourceCard
                    resource={r}
                    role={role}
                    onSave={() => toggleSave(r.id)}
                    onExplore={() => onExplore(r)}
                    onSummary={() => onOpenSummary(r)}
                    onRecommend={() => toggleRecommend(r.id)}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-gray-300">
              No recommendations yet. View a few resources and we’ll personalize this.
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {summaryOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onCloseSummary}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#120822]/90 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-extrabold">{summaryResource?.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">AI Summary</p>
                </div>
                <button
                  type="button"
                  onClick={onCloseSummary}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 text-sm font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 text-gray-200 leading-relaxed">
                {summaryResource?.aiSummary ? (
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4">{summaryResource.aiSummary}</div>
                ) : (
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-gray-300">
                    No AI summary available yet. (This will be generated by your AI layer and stored in the resource.)
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => summaryResource && onExplore(summaryResource)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-semibold"
                >
                  Explore
                </button>
                <button
                  type="button"
                  onClick={() => summaryResource && toggleSave(summaryResource.id)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 text-sm font-semibold"
                >
                  {summaryResource?.isSaved ? 'Unsave' : 'Save'}
                </button>
                {role === 'senior' ? (
                  <button
                    type="button"
                    onClick={() => summaryResource && toggleRecommend(summaryResource.id)}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 text-sm font-semibold"
                  >
                    {summaryResource?.isRecommendedForJuniorsByMe ? 'Unrecommend' : 'Recommend for Juniors'}
                  </button>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
