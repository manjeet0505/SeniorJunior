'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Sample blog data (replace with real data/API later)
const featuredPost = {
  id: 'featured',
  tag: 'Featured',
  title: 'Mentorship at Scale: How AI Turns Conversations into Career Momentum',
  summary: 'Why most mentorship fails to compound—and how structured AI-driven loops turn guidance into measurable outcomes.',
  readTime: '8 min read',
  href: '/blog/mentorship-at-scale',
};

const blogPosts = [
  {
    id: 1,
    title: '5 Signals You’re Ready for a Senior Mentor',
    insight: 'Clarity beats speed—know when to seek guidance.',
    readTime: '4 min read',
    category: 'Juniors',
    href: '/blog/5-signals-senior-mentor',
  },
  {
    id: 2,
    title: 'Mentoring Without Burnout: A Senior’s Playbook',
    insight: 'Leverage your time with structure and AI continuity.',
    readTime: '6 min read',
    category: 'Seniors',
    href: '/blog/mentoring-without-burnout',
  },
  {
    id: 3,
    title: 'AI as a Mentorship Co-Pilot, Not Replacement',
    insight: 'Use AI to summarize, recommend, and track—humans guide.',
    readTime: '5 min read',
    category: 'AI',
    href: '/blog/ai-mentorship-copilot',
  },
  {
    id: 4,
    title: 'From Junior to Confident: A 90-Day Roadmap',
    insight: 'Weekly milestones that turn ambiguity into momentum.',
    readTime: '7 min read',
    category: 'Career',
    href: '/blog/junior-to-confident-90-day',
  },
  {
    id: 5,
    title: 'How to Run a Mentorship Session That Compounds',
    insight: 'Structure your 1:1s for continuity and outcomes.',
    readTime: '5 min read',
    category: 'Mentorship',
    href: '/blog/run-compound-mentorship-session',
  },
];

const categories = ['All', 'Juniors', 'Seniors', 'Mentorship', 'Career', 'AI'];

// Blog Card Components
export function StandardBlogCard({ post, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/20"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-white/70">
          {post.category}
        </span>
        <span className="text-xs text-white/50">{post.readTime}</span>
      </div>
      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
        {post.title}
      </h3>
      <p className="text-sm text-white/60 mb-4">{post.insight}</p>
      <Link
        href={post.href}
        className="inline-flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors"
      >
        Read <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </motion.article>
  );
}

export function FeaturedBlogCard({ post }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8 sm:p-10 transition-all duration-300 hover:border-white/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
          {post.tag}
        </span>
        <span className="text-xs text-white/50">{post.readTime}</span>
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 group-hover:text-white/90 transition-colors">
        {post.title}
      </h2>
      <p className="text-sm sm:text-base text-white/70 mb-6 leading-relaxed">{post.summary}</p>
      <Link
        href={post.href}
        className="inline-flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors"
      >
        Read article <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </motion.article>
  );
}

export function CompactBlogCard({ post }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="group rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl p-4 transition-all duration-300 hover:border-white/20"
    >
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-white/70 mb-2">
        {post.category}
      </span>
      <h4 className="text-sm font-medium text-white group-hover:text-white/90 transition-colors line-clamp-2">
        {post.title}
      </h4>
    </motion.article>
  );
}

export default function BlogPage() {
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
            Thought Leadership
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-white"
          >
            Insights from
            <span className="text-white/70"> Mentors & Builders</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="mt-6 text-base sm:text-lg leading-relaxed text-white/70"
          >
            Learn how AI-powered mentorship turns conversations into career momentum. For juniors seeking clarity and seniors mentoring at scale.
          </motion.p>
        </div>

        {/* Featured Blog Section */}
        <div className="mt-14">
          <FeaturedBlogCard post={featuredPost} />
        </div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="mt-14 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                cat === 'All'
                  ? 'border-white/20 bg-white/10 text-white'
                  : 'border-white/10 bg-black/30 backdrop-blur-xl text-white/70 hover:border-white/20 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <StandardBlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Empty State (shown when no posts) */}
        {blogPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            className="mt-20 text-center"
          >
            <p className="text-white/60">We’re crafting high-signal mentorship and AI learning content. Stay tuned.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
