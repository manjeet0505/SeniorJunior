'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blogs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on selected category
  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.tags?.includes(selectedCategory.toLowerCase()));

  // Get unique categories from tags
  const categories = ['All', ...new Set(blogs.flatMap(blog => blog.tags || []))];

  // Featured blog (first one or marked as featured)
  const featuredBlog = blogs.find(blog => blog.featured) || blogs[0];
  const standardBlogs = filteredBlogs.filter(blog => blog !== featuredBlog);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="h-96 bg-gray-800 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                <div className="h-32 bg-gray-800 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-semibold mb-4 text-red-400">Failed to load blogs</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative px-4 py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute top-24 -left-32 h-[520px] w-[520px] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute bottom-0 -right-32 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            High-signal insights on mentorship, AI, and engineering growth
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-14"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="lg:col-span-2"
              >
                <div className="relative group rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500/50 via-purple-500/40 to-blue-500/40">
                  <div className="absolute inset-0 rounded-3xl blur-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-blue-500/20 opacity-60 group-hover:opacity-90 transition-opacity" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
                    <div className="relative p-7 sm:p-10">
                      <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
                          Editor’s Pick
                        </span>
                        <span className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-200">
                          Featured
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-white">
                        {featuredBlog.title}
                      </h2>

                      <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed max-w-3xl">
                        {featuredBlog.excerpt}
                      </p>

                      <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(featuredBlog.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {featuredBlog.readTime}
                          </div>
                        </div>

                        <Link
                          href={`/blog/${featuredBlog.slug}`}
                          className="inline-flex items-center justify-center rounded-2xl bg-white text-black px-5 py-3 text-sm font-semibold transition-all hover:bg-white/90"
                        >
                          Read
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>

                      {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                        <div className="mt-7 flex flex-wrap gap-2">
                          {featuredBlog.tags.slice(0, 6).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="h-full"
              >
                <div className="h-full rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-7">
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                    Why read these blogs?
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    Written to help juniors think like seniors.
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    No fluff. No recycled tutorials. Every post is structured like a mentor session: context,
                    trade-offs, and practical next steps you can apply in your projects and interviews.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/70">
                        We optimize for clarity, not virality.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/70">
                        Read one post. Improve one decision. Repeat.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  cat === selectedCategory
                    ? 'bg-white text-black border-white'
                    : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:text-white'
                } border`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardBlogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-white/20"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -inset-20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 blur-2xl" />
              </div>

              <div className="relative p-6">
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 2 && (
                      <span className="text-xs text-white/50">+{blog.tags.length - 2}</span>
                    )}
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-3 leading-tight text-white group-hover:text-white/90 transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-white/65 mb-6 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {blog.readTime}
                    </div>
                  </div>
                  
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/80 text-sm font-semibold transition-all duration-300 hover:bg-white/10"
                  >
                    Read
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">
              No blogs found for "{selectedCategory}"
            </p>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}
