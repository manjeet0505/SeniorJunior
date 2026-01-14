'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useProfile } from '@/hooks/useProfile';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TAB_LABELS = Object.freeze({
  overview: 'Overview',
  skills: 'Skills',
  availability: 'Availability',
  growth: 'Growth',
  impact: 'Impact'
});

const STATUS_CONFIG = Object.freeze({
  open: { label: 'Open', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  busy: { label: 'Busy', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  offline: { label: 'Offline', className: 'bg-gray-500/15 text-gray-300 border-gray-500/30' }
});

function formatRole(role) {
  if (role === 'senior') return 'Senior';
  if (role === 'junior') return 'Junior';
  return 'User';
}

const StatusPill = memo(function StatusPill({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', s.className)}>
      {s.label}
    </span>
  );
});

const RoleBadge = memo(function RoleBadge({ role }) {
  const isSenior = role === 'senior';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        isSenior
          ? 'bg-indigo-500/15 text-indigo-200 border-indigo-500/30'
          : 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30'
      )}
    >
      {formatRole(role)}
    </span>
  );
});

const Chip = memo(function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
      {children}
    </span>
  );
});

const Stat = memo(function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-sm font-semibold text-white">{value ?? '—'}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
});

const SidebarSkeleton = memo(function SidebarSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-white/10" />
        <div className="flex-1">
          <div className="h-4 w-36 rounded bg-white/10" />
          <div className="mt-2 h-3 w-24 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="h-14 rounded-xl bg-white/5" />
        <div className="h-14 rounded-xl bg-white/5" />
        <div className="h-14 rounded-xl bg-white/5" />
      </div>
      <div className="mt-6">
        <div className="h-3 w-28 rounded bg-white/10" />
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="h-7 w-20 rounded-full bg-white/5" />
          <div className="h-7 w-16 rounded-full bg-white/5" />
          <div className="h-7 w-24 rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  );
});

const Tabs = memo(function Tabs({ value, onChange, items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-all border',
              active
                ? 'bg-white text-[#1A0B2E] border-white'
                : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
});

const InlineEditableText = memo(function InlineEditableText({ label, value, editable, placeholder, onSave, saving }) {
  const [draft, setDraft] = useState(value ?? '');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDraft(value ?? '');
    setDirty(false);
  }, [value]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
      <div className="text-sm font-semibold text-white">{label}</div>
      <div className="mt-3">
        {editable ? (
          <>
            <textarea
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setDirty(true);
              }}
              rows={4}
              placeholder={placeholder}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(value ?? '');
                  setDirty(false);
                }}
                disabled={!dirty || saving}
                className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onSave(draft)}
                disabled={!dirty || saving}
                className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-300">
            {value && String(value).trim() ? value : <span className="text-gray-500">{placeholder}</span>}
          </div>
        )}
      </div>
    </div>
  );
});

const SkillsEditor = memo(function SkillsEditor({ title, chips, editable, placeholder, onSave, saving }) {
  const [draft, setDraft] = useState((chips || []).join(', '));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDraft((chips || []).join(', '));
    setDirty(false);
  }, [chips]);

  const parsed = useMemo(() => {
    return draft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [draft]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-gray-400">{editable ? 'Comma separated' : ''}</div>
        </div>
      </div>

      <div className="mt-4">
        {editable ? (
          <>
            <input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setDirty(true);
              }}
              placeholder={placeholder}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {parsed.length ? parsed.map((s) => <Chip key={s}>{s}</Chip>) : <span className="text-sm text-gray-500">No items yet</span>}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft((chips || []).join(', '));
                  setDirty(false);
                }}
                disabled={!dirty || saving}
                className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onSave(parsed)}
                disabled={!dirty || saving}
                className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(chips || []).length ? (chips || []).map((s) => <Chip key={s}>{s}</Chip>) : <span className="text-sm text-gray-500">{placeholder}</span>}
          </div>
        )}
      </div>
    </div>
  );
});

export default function ProfilePageClient({ userId }) {
  const [tab, setTab] = useState('overview');
  const { profile, user, stats, viewer, loading, error, updateUser, connect } = useProfile(userId);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const isOwnProfile = Boolean(viewer?.isOwnProfile);
  const role = user?.role;

  const tabs = useMemo(() => {
    const common = [
      { value: 'overview', label: TAB_LABELS.overview },
      { value: 'skills', label: TAB_LABELS.skills },
      { value: 'availability', label: TAB_LABELS.availability }
    ];

    if (role === 'junior') {
      return [
        ...common,
        { value: 'growth', label: TAB_LABELS.growth }
      ];
    }

    if (role === 'senior') {
      return [
        ...common,
        { value: 'impact', label: TAB_LABELS.impact }
      ];
    }

    return common;
  }, [role]);

  const primaryCta = useMemo(() => {
    if (!user) return null;

    if (isOwnProfile) {
      return {
        label: 'Edit Profile',
        href: '/profile/edit'
      };
    }

    if (role === 'junior') {
      return {
        label: 'Request Mentorship',
        href: `/messages/${user.id}`
      };
    }

    if (role === 'senior') {
      return {
        label: 'Schedule Session',
        href: '/schedule'
      };
    }

    return null;
  }, [isOwnProfile, role, user]);

  const savePatch = useCallback(async (patch) => {
    if (!user?.id || saving) return;
    setSaving(true);
    try {
      await updateUser(patch);
    } finally {
      setSaving(false);
    }
  }, [saving, updateUser, user?.id]);

  const onConnect = useCallback(async () => {
    if (connecting) return;
    setConnecting(true);
    try {
      await connect();
    } finally {
      setConnecting(false);
    }
  }, [connect, connecting]);

  const onSaveBio = useCallback((bio) => savePatch({ bio }), [savePatch]);
  const onSaveSkills = useCallback((skills) => savePatch({ skills }), [savePatch]);
  const onSaveLearningSkills = useCallback((learningSkills) => savePatch({ learningSkills }), [savePatch]);
  const onSaveMentorshipTopics = useCallback(
    (lookingForMentorshipIn) => savePatch({ lookingForMentorshipIn }),
    [savePatch]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SidebarSkeleton />
            </div>
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
                <div className="h-4 w-48 rounded bg-white/10" />
                <div className="mt-6 h-10 w-full rounded bg-white/5" />
                <div className="mt-6 h-40 w-full rounded bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <ErrorDisplay error={error} />
        </div>
      </div>
    );
  }

  if (!profile?.user) {
    return (
      <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <ErrorDisplay error="Profile not available." />
        </div>
      </div>
    );
  }

  const canEditJuniorSections = isOwnProfile && role === 'junior';

  return (
    <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-6">
            <ErrorDisplay error={error} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px]">
                    <div className="h-full w-full rounded-full bg-[#1A0B2E] p-[2px]">
                      <img
                        src={user.profilePicture || '/default-avatar.png'}
                        alt={user.username}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-lg font-bold text-white">{user.username}</div>
                    <RoleBadge role={user.role} />
                    <StatusPill status={user.status} />
                  </div>

                  <div className="mt-1 text-sm text-gray-400 truncate">{user.email}</div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {primaryCta ? (
                      <Link
                        href={primaryCta.href}
                        className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] transition-transform"
                      >
                        {primaryCta.label}
                      </Link>
                    ) : null}

                    {!isOwnProfile ? (
                      <button
                        type="button"
                        onClick={onConnect}
                        disabled={connecting}
                        className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-gray-200 hover:bg-white/10"
                      >
                        {connecting ? 'Connecting...' : 'Connect'}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat label="Connections" value={stats?.connections} />
                <Stat label="Sessions" value={stats?.sessions} />
                <Stat label="Rating" value={stats?.rating ?? '—'} />
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold text-gray-300">Top Skills</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(user.skills || []).slice(0, 8).map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                  {(user.skills || []).length === 0 ? (
                    <span className="text-sm text-gray-500">No skills added yet</span>
                  ) : null}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold text-gray-300">Social</div>
                <div className="mt-3 grid gap-2">
                  {user.social?.github ? (
                    <a className="text-sm text-blue-300 hover:text-blue-200" href={user.social.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">GitHub not provided</span>
                  )}
                  {user.social?.linkedin ? (
                    <a className="text-sm text-blue-300 hover:text-blue-200" href={user.social.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">LinkedIn not provided</span>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xl font-bold text-white">Profile</div>
                  <div className="mt-1 text-sm text-gray-400">
                    {role === 'junior'
                      ? 'Focused on growth and mentorship requests.'
                      : role === 'senior'
                        ? 'Focused on credibility and mentoring impact.'
                        : 'User profile.'}
                  </div>
                </div>

                <Tabs value={tab} onChange={setTab} items={tabs} />
              </div>

              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mt-6"
              >
                {tab === 'overview' ? (
                  <div className="grid gap-6">
                    <InlineEditableText
                      label="Bio"
                      value={user.bio}
                      editable={isOwnProfile}
                      placeholder={role === 'junior' ? 'Tell seniors what you are working on and where you need guidance.' : 'Summarize your expertise and mentoring style.'}
                      saving={saving}
                      onSave={onSaveBio}
                    />

                    {role === 'junior' ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        <SkillsEditor
                          title="Looking for mentorship in"
                          chips={user.lookingForMentorshipIn}
                          editable={canEditJuniorSections}
                          placeholder="React, System Design, Interviews"
                          saving={saving}
                          onSave={onSaveMentorshipTopics}
                        />
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
                          <div className="text-sm font-semibold text-white">Progress</div>
                          <div className="mt-2 text-sm text-gray-400">
                            Sessions attended: <span className="text-white font-semibold">{stats?.learningSessions ?? 0}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400">
                            Total sessions: <span className="text-white font-semibold">{stats?.sessions ?? 0}</span>
                          </div>
                          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                            This area is designed for future AI scoring (profile completeness, skill growth, recommendations).
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {role === 'senior' ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
                          <div className="text-sm font-semibold text-white">Experience</div>
                          <div className="mt-2 text-sm text-gray-400">
                            Years of experience: <span className="text-white font-semibold">{user.yearsOfExperience || 0}</span>
                          </div>
                          <div className="mt-4 text-sm text-gray-400">
                            Mentorship sessions: <span className="text-white font-semibold">{stats?.mentorshipSessions ?? 0}</span>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
                          <div className="text-sm font-semibold text-white">Trust Signals</div>
                          <div className="mt-2 text-sm text-gray-400">Rating & feedback will appear here when ratings are implemented.</div>
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <Stat label="Sessions" value={stats?.sessions ?? 0} />
                            <Stat label="Mentored" value={stats?.menteesHelped ?? '—'} />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {tab === 'skills' ? (
                  <div className="grid gap-6">
                    <SkillsEditor
                      title="Skills"
                      chips={user.skills}
                      editable={isOwnProfile}
                      placeholder="JavaScript, React, Node.js"
                      saving={saving}
                      onSave={onSaveSkills}
                    />

                    {role === 'junior' ? (
                      <SkillsEditor
                        title="Learning"
                        chips={user.learningSkills}
                        editable={canEditJuniorSections}
                        placeholder="TypeScript, System Design"
                        saving={saving}
                        onSave={onSaveLearningSkills}
                      />
                    ) : null}
                  </div>
                ) : null}

                {tab === 'availability' ? (
                  <div className="grid gap-6">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
                      <div className="text-sm font-semibold text-white">Availability</div>
                      <div className="mt-2 text-sm text-gray-400">
                        Availability scheduling is stored as structured data in `user.availability`. The UI here is ready for your future calendar + slot editor.
                      </div>
                      <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-gray-300">
                        {JSON.stringify(user.availability ?? null, null, 2)}
                      </pre>
                      {isOwnProfile ? (
                        <div className="mt-4 text-sm text-gray-400">
                          For now, edit availability via API until we implement the calendar editor.
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {tab === 'growth' && role === 'junior' ? (
                  <div className="grid gap-6">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
                      <div className="text-sm font-semibold text-white">Learning Focus</div>
                      <div className="mt-2 text-sm text-gray-400">
                        This tab prioritizes editable sections and progress indicators for juniors.
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <Stat label="Sessions attended" value={stats?.learningSessions ?? 0} />
                        <Stat label="Connections" value={stats?.connections ?? 0} />
                        <Stat label="Profile score" value={'—'} />
                      </div>
                    </div>
                  </div>
                ) : null}

                {tab === 'impact' && role === 'senior' ? (
                  <div className="grid gap-6">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
                      <div className="text-sm font-semibold text-white">Mentoring Impact</div>
                      <div className="mt-2 text-sm text-gray-400">
                        This tab is designed for credibility and outcomes: mentees helped, ratings, reviews, and session outcomes.
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <Stat label="Mentorship sessions" value={stats?.mentorshipSessions ?? 0} />
                        <Stat label="Rating" value={stats?.rating ?? '—'} />
                        <Stat label="Mentees helped" value={stats?.menteesHelped ?? '—'} />
                      </div>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
