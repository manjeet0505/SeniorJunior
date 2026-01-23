'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

export default function BlogReadPage() {
  const params = useParams();
  const slug = params?.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog post not found');
          } else {
            setError('Failed to load blog post');
          }
          return;
        }
        
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-32 mb-8"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-semibold mb-4 text-red-400">{error}</h1>
            <Link 
              href="/blog"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Blog Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {blog.readTime}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <section className="mb-8">
            <div className="rounded-xl border border-indigo-500/20 bg-slate-900/40 backdrop-blur-md ring-1 ring-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.12)]">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-semibold text-indigo-300">🤖 AI Summary</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">Premium</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-indigo-300 transition-transform duration-300 ${summaryOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {summaryOpen && (
                <div className="px-4 pb-4 md:px-5 md:pb-5 text-sm md:text-base leading-relaxed text-white/80 whitespace-pre-line">
                  {blog?.aiSummary && blog.aiSummary.trim().length > 0 ? (
                    blog.aiSummary
                  ) : (
                    <span className="text-gray-400 italic">AI is preparing a summary for this article.</span>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Blog Content */}
          <article className="prose prose-invert prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-white/75 prose-li:text-white/75 prose-strong:text-white prose-a:text-indigo-300 hover:prose-a:text-indigo-200 prose-hr:border-white/10 prose-blockquote:border-white/10 prose-blockquote:text-white/70 prose-code:text-white/80 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {blog.content}
            </ReactMarkdown>
          </article>
        </motion.div>
      </div>
    </div>
  );
}
