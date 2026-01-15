'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function CommunityPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 -left-24 h-[520px] w-[520px] rounded-full bg-blue-500/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        {/* Hero Section */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl px-3 py-1 text-xs text-white/70"
          >
            Community
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-white"
          >
            Learn together,
            <span className="text-white/70"> grow together</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 text-base sm:text-lg leading-relaxed text-white/70"
          >
            A space for high-signal mentorship, knowledge sharing, and deliberate growth. No noise—just progress.
          </motion.p>
        </div>

        {/* What This Community Is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="mt-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }}
            className="text-2xl font-semibold text-white mb-10"
          >
            What this community is
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Knowledge sharing',
                body: 'Practical insights from real projects. What worked, what didn’t, and why.',
                not: 'No generic tips or motivational posts.',
              },
              {
                title: 'Mentor–junior guidance',
                body: 'Structured conversations that turn questions into clear next steps.',
                not: 'No open-ended debates or opinion threads.',
              },
              {
                title: 'High-signal discussions',
                body: 'Focused threads that compound into learning paths.',
                not: 'No memes, off-topic chatter, or spam.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/20"
              >
                <h3 className="text-sm font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-3">{item.body}</p>
                <p className="text-xs text-white/50 italic">Not: {item.not}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How Community Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
          className="mt-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5, ease: 'easeOut' }}
            className="text-2xl font-semibold text-white mb-10"
          >
            How community works
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
            className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Juniors participate',
                  body: 'Ask specific questions, share progress, and apply insights from mentors.',
                },
                {
                  title: 'Seniors guide',
                  body: 'Answer with context, recommend resources, and help shape learning paths.',
                },
                {
                  title: 'AI assists',
                  body: 'Summarize threads, suggest next steps, and keep discussions on track.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                  className="text-center"
                >
                  <h4 className="text-sm font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-white/70 leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Ways to Participate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
          className="mt-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.5, ease: 'easeOut' }}
            className="text-2xl font-semibold text-white mb-10"
          >
            Ways to participate
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Read discussions',
                body: 'Browse high-signal threads and curated learning paths.',
                badge: 'Available',
              },
              {
                title: 'Share insights',
                body: 'Post lessons from real projects and mentorship sessions.',
                badge: 'Invite-only',
              },
              {
                title: 'Mentor juniors',
                body: 'Guide juniors with structured, actionable feedback.',
                badge: 'Invite-only',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-white/60">
                    {item.badge}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}
          className="mt-20 text-center"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/90"
            >
              Be part of community
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CommunityPage;