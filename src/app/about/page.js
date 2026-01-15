'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-40 -left-24 h-[520px] w-[520px] rounded-full bg-blue-500/15 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl px-3 py-1 text-xs text-white/70"
          >
            AI Mentoring Platform
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-white"
          >
            Senior guidance.
            <span className="text-white/70"> AI clarity.</span>
            <span className="block">Real outcomes.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 text-base sm:text-lg leading-relaxed text-white/70"
          >
            SeniorJunior exists to make mentorship reliable at scale. We connect junior developers with experienced seniors and use AI to turn
            sessions, goals, and progress into a clear plan you can execute.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
            className="mt-10 flex flex-col sm:flex-row gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/find-a-mentor"
                className="inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/90"
              >
                Find a Mentor
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/resources"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
              >
                Explore Resources
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              title: 'Signal over noise',
              body: 'High-context mentorship, not generic advice. Sessions are driven by your goals, code, and constraints.',
            },
            {
              title: 'AI-guided momentum',
              body: 'AI turns scattered learning into a roadmap: what to do next, why it matters, and how to measure progress.',
            },
            {
              title: 'Mentors who stay efficient',
              body: 'Seniors spend time where it matters: feedback, direction, and decision-making.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6"
            >
              <div className="text-sm font-medium text-white">{item.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
          className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8"
          >
            <h2 className="text-lg font-semibold text-white">Why SeniorJunior exists</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Junior devs don’t fail because they’re not working hard—they fail because they don’t know what matters most right now.
              Seniors want to help, but context-switching is expensive.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              SeniorJunior is built to make mentorship actionable: consistent expectations, structured sessions, and a feedback loop that
              compounds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8"
          >
            <h2 className="text-lg font-semibold text-white">Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Help every developer make better career decisions faster—through mentorship that’s measurable, personalized, and scalable.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'For juniors', body: 'Clear direction, stronger fundamentals, and faster interview readiness.' },
                { title: 'For seniors', body: 'High leverage mentoring with less admin and better continuity.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <p className="mt-2 text-sm text-white/70">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6, ease: 'easeOut' }}
          className="mt-14 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.5, ease: 'easeOut' }}
            className="text-lg font-semibold text-white"
          >
            How AI helps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5, ease: 'easeOut' }}
            className="mt-3 text-sm leading-relaxed text-white/70"
          >
            AI doesn’t replace mentors. It removes friction: it summarizes, structures, recommends, and keeps the plan coherent across weeks.
          </motion.p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Guided learning plans',
                body: 'Turn goals into weekly execution plans with clear milestones.',
              },
              {
                title: 'Resource recommendations',
                body: 'Curate what to read/watch/build based on your current level and gaps.',
              },
              {
                title: 'Mentorship continuity',
                body: 'Keep context between sessions so advice compounds instead of resetting.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.45 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="text-sm font-medium text-white">{item.title}</div>
                <p className="mt-2 text-sm text-white/70">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6, ease: 'easeOut' }}
          className="mt-14 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.65, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <div className="relative size-24 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <img
                  src="/manjeet-image.jpg"
                  alt="Creator of SeniorJunior"
                  className="size-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5, ease: 'easeOut' }}
              className="flex-1"
            >
              <motion.h2
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.72, duration: 0.4, ease: 'easeOut' }}
                className="text-lg font-semibold text-white"
              >
                Built by creator
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.74, duration: 0.4, ease: 'easeOut' }}
                className="mt-3 text-sm leading-relaxed text-white/70"
              >
                SeniorJunior is built from direct experience with junior developer struggles: unclear priorities, wasted effort, and fragmented mentorship.
                The platform is designed to make mentorship actionable and measurable for both sides.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.76, duration: 0.4, ease: 'easeOut' }}
                className="mt-3 text-sm leading-relaxed text-white/70"
              >
                The goal isn’t storytelling—it’s a product that consistently turns guidance into outcomes.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6, ease: 'easeOut' }}
          className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.85, duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-1"
          >
            <motion.h2
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.86, duration: 0.4, ease: 'easeOut' }}
              className="text-lg font-semibold text-white"
            >
              What makes us different
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.87, duration: 0.4, ease: 'easeOut' }}
              className="mt-3 text-sm leading-relaxed text-white/70"
            >
              Most platforms stop at matching. SeniorJunior goes further: we help you execute.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { title: 'Role-aware experience', body: 'Juniors get guidance and structure. Seniors get tools and leverage.' },
              { title: 'Outcome-focused loops', body: 'From session insights to action items to measurable progress.' },
              { title: 'Better than generic AI', body: 'AI is grounded in mentorship context, not just prompts.' },
              { title: 'Built for consistency', body: 'Progress stays coherent over time, even as your goals evolve.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.92 + i * 0.04, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6"
              >
                <div className="text-sm font-medium text-white">{item.title}</div>
                <p className="mt-2 text-sm text-white/70">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.6, ease: 'easeOut' }}
          className="mt-14 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.12, duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.13, duration: 0.3, ease: 'easeOut' }}
              className="text-sm font-medium text-white"
            >
              Ready to move faster with clarity?
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.14, duration: 0.3, ease: 'easeOut' }}
              className="mt-2 text-sm text-white/70"
            >
              Explore resources built for execution—or connect with a mentor.
            </motion.p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/find-a-mentor"
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/90"
            >
              Find a Mentor
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
