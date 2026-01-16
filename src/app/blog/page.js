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
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
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
            className="mb-16"
          >
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 hover:border-gray-700 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium rounded-full">
                    Featured
                  </span>
                  {featuredBlog.featured && (
                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-medium rounded-full">
                      ⭐ Must Read
                    </span>
                  )}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-white transition-colors">
                  {featuredBlog.title}
                </h2>
                
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  {featuredBlog.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(featuredBlog.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredBlog.readTime}
                    </div>
                  </div>
                  
                  <Link
                    href={`/blog/${featuredBlog.slug}`}
                    className="inline-flex items-center px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 group-hover:scale-105"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>

                {/* Tags */}
                {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {featuredBlog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
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
              className="group bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
                    )}
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-white transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
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
                    className="inline-flex items-center px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 group-hover:scale-105"
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
  );
}
