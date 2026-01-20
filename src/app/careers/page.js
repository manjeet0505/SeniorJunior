'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const openRoles = [
  {
    title: 'Frontend Engineer',
    description: 'Craft the interface where mentorship happens. Build responsive, accessible experiences with React, Next.js, and Tailwind.',
    badge: 'Coming soon',
  },
  {
    title: 'Backend Engineer',
    description: 'Scale the mentorship engine. Build APIs, real-time features, and AI integrations with Node.js and MongoDB.',
    badge: 'Coming soon',
  },
  {
    title: 'AI Engineer',
    description: 'Shape the AI co-pilot for mentorship. Work on recommendation models, summarization, and learning-path generation.',
    badge: 'Coming soon',
  },
];

export default function CareersPage() {
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
            Join the team
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-white"
          >
            Build the future of
            <span className="text-white/70"> AI-driven mentorship</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 text-base sm:text-lg leading-relaxed text-white/70"
          >
            We’re a small, product-focused team turning mentorship into a measurable, scalable system. Ship features, own outcomes, and help developers grow faster.
          </motion.p>
        </div>

        {/* Why Work at SeniorJunior */}
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
            Why work at SeniorJunior
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[/* eslint-disable */
              {
                title: 'Ownership from day one',
                body: 'You’ll drive features end-to-end: research, build, ship, and iterate. No handoffs, no bureaucracy.',
              },
              {
                title: 'Real-world AI impact',
                body: 'Ship AI that turns mentorship conversations into actionable learning paths for thousands of developers.',
              },
              {
                title: 'Learn by building',
                body: 'Work closely with product, AI, and design. Grow your skills while solving hard mentorship problems.',
              },
              {
                title: 'Early-stage equity',
                body: 'Join as a foundational team member and share in the upside as we scale.',
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
                <p className="text-sm text-white/70 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What We Look For */}
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
            What we look for
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
            className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8"
          >
            <ul className="space-y-4">
              {[/* eslint-disable */
                'Bias toward action: you ship quickly and iterate.',
                'Product sense: you care about user problems, not just code.',
                'Curiosity: you dig into mentorship challenges and learn continuously.',
                'Ownership: you see features through from idea to impact.',
                'Collaboration: you make the whole team better.',
              ].map((bullet, i) => (
                <motion.li
                  key={bullet}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.95 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                  className="flex items-start gap-3 text-sm text-white/80"
                >
                  <span className="mt-0.5 size-1.5 rounded-full bg-white/40 flex-shrink-0" />
                  {bullet}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Open Roles */}
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
            Open roles
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openRoles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-base font-semibold text-white">{role.title}</h3>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-white/60">
                    {role.badge}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{role.description}</p>
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
              Join the journey
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
