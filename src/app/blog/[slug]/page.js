'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BlogReadPage() {
  const params = useParams();
  const slug = params?.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

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

  useEffect(() => {
    if (!slug) return;
    let aborted = false;
    setRelatedLoading(true);
    fetch(`/api/blogs/${slug}/related-resources?limit=5`)
      .then((res) => (res.ok ? res.json() : { resources: [] }))
      .then((data) => {
        if (aborted) return;
        const items = Array.isArray(data?.resources) ? data.resources : [];
        setRelated(items);
      })
      .catch(() => {
        if (aborted) return;
        setRelated([]);
      })
      .finally(() => {
        if (aborted) return;
        setRelatedLoading(false);
      });
    return () => {
      aborted = true;
    };
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

  const titleText = (blog?.title || '').trim();
  const rawContent = (blog?.content || '').toString();
  const contentTrimStart = rawContent.replace(/^\s+/, '');
  const contentWithoutHash = contentTrimStart.replace(/^#\s+/, '');
  const startsWithTitle = titleText && contentWithoutHash.toLowerCase().startsWith(titleText.toLowerCase());
  let cleanedContent = startsWithTitle
    ? contentWithoutHash.slice(titleText.length).replace(/^[\s\r\n-_:]+/, '')
    : contentTrimStart;
  const paragraphs = cleanedContent
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

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
                <div className="px-4 pb-4 md:px-5 md:pb-5 text-sm md:text-base leading-relaxed text-white/80">
                  <p className="text-[11px] md:text-xs text-white/50 italic mb-3">This summary is generated once using AI and cached for fast access.</p>
                  <div className="whitespace-pre-line">
                    {blog?.aiSummary && blog.aiSummary.trim().length > 0 ? (
                      blog.aiSummary
                    ) : (
                      <span className="text-gray-400 italic">AI is preparing a summary for this article.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Blog Content */}
          <article className="prose prose-invert prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-white/75 prose-li:text-white/75 prose-strong:text-white prose-a:text-indigo-300 hover:prose-a:text-indigo-200 prose-hr:border-white/10 prose-blockquote:border-white/10 prose-blockquote:text-white/70 prose-code:text-white/80 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))
            ) : (
              <p>{cleanedContent.trim()}</p>
            )}
          </article>

          {/* Related Resources */}
          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Recommended Resources to Act On</h2>
            {relatedLoading ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="h-28 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                <div className="h-28 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              </div>
            ) : related.length === 0 ? (
              <p className="text-white/60 text-sm">More resources coming soon for this topic.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {related.map((r) => (
                  <div
                    key={r.id}
                    className="group rounded-2xl border border-indigo-500/20 bg-slate-900/40 backdrop-blur-md ring-1 ring-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.12)] hover:border-indigo-400/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.18)] transition"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">{r.type}</span>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">{r.difficulty}</span>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-lg leading-snug mb-1">{r.title}</h3>
                      {r.description && (
                        <p className="text-white/70 text-sm mb-4">{r.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/50">{r.category}</div>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-sm hover:bg-indigo-500/30 hover:text-white transition"
                        >
                          Explore Resource
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </motion.div>
      </div>
    </div>
  );
}
