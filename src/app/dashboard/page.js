'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth, getAuthHeaders } from '@/utils/authUtils';
import { motion } from 'framer-motion';
import { Users, Mail, Search, Calendar, BookOpen, Zap } from 'lucide-react';

const StatCard = ({ icon, title, value, helperText }) => (
  <motion.div
    className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex items-center gap-6"
    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(192, 132, 252, 0.3)' }}
  >
    <div className="bg-white/10 p-4 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      {helperText && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
    </div>
  </motion.div>
);

const CuratedReadingCard = ({ blog }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55 }}
    className="group relative rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-white/20"
    whileHover={{ y: -4 }}
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="absolute -inset-20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 blur-2xl" />
    </div>

    <div className="relative p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-white/60">
            AI-Curated Reading
          </p>
          <h3 className="mt-2 text-xl font-semibold leading-tight text-white">
            {blog?.title || 'Reading unavailable'}
          </h3>
        </div>

        <div className="shrink-0 rounded-full border border-white/10 bg-white/5 p-3 text-white/70">
          <BookOpen size={18} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/65 line-clamp-3">
        {blog?.excerpt || 'We couldn\'t load a blog right now. Please try again in a moment.'}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-white/50">
          Handpicked to improve your next technical decision.
        </p>

        {blog?.slug ? (
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/80 text-sm font-semibold transition-all duration-300 hover:bg-white/10"
          >
            Read in 5 minutes
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="inline-flex items-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/40 text-sm font-semibold">
            Read in 5 minutes
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const SeniorDeveloperCard = ({ senior }) => (
  <motion.div
    className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:border-purple-500/50 transition-colors duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <span className="text-4xl font-bold">{senior.username.charAt(0).toUpperCase()}</span>
    </div>
    <h3 className="text-xl font-bold">{senior.username}</h3>
    <p className="text-gray-400 text-sm mb-4">{senior.role}</p>
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {senior.skills.slice(0, 3).map((skill) => (
        <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">{skill}</span>
      ))}
    </div>
    <Link href={`/profile/${senior._id}`} className="px-6 py-2 bg-white/10 rounded-full font-semibold hover:bg-white/20 transition-colors duration-300">
      View Profile
    </Link>
  </motion.div>
);

const QuickActionCard = ({ icon, title, description, href }) => (
  <Link href={href}>
    <motion.div
      className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center h-full flex flex-col items-center justify-center hover:border-purple-500/50 transition-colors duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="bg-white/10 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  </Link>
);

const NextStepCard = ({ user, stats }) => {
  const getNextStep = () => {
    if (user.role === 'junior') {
      if (stats.connections === 0) {
        return {
          title: "Find Senior Developers",
          description: "Connect with experienced mentors who can help you grow your skills",
          action: "Browse Senior Developers",
          href: "/seniors",
          icon: <Search size={32} />
        };
      } else if (stats.pendingRequests > 0) {
        return {
          title: "Review Your Requests",
          description: "You have pending connection requests waiting for your response",
          action: "View Requests",
          href: "/connections",
          icon: <Users size={32} />
        };
      } else {
        return {
          title: "Book Your First Session",
          description: "Schedule a one-on-one mentoring session with a senior developer",
          action: "Schedule Session",
          href: "/schedule",
          icon: <Calendar size={32} />
        };
      }
    } else {
      if (stats.connections === 0) {
        return {
          title: "Help Junior Developers",
          description: "Share your knowledge and mentor the next generation of developers",
          action: "Find Junior Developers",
          href: "/juniors",
          icon: <Users size={32} />
        };
      } else {
        return {
          title: "Check Your Messages",
          description: "Stay connected with your mentees and answer their questions",
          action: "View Messages",
          href: "/messages",
          icon: <Mail size={32} />
        };
      }
    }
  };

  const nextStep = getNextStep();

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-500/20 p-3 rounded-full">
            {nextStep.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-300">AI Recommended Next Step</h3>
            <p className="text-gray-300 text-sm">Based on your activity and learning stage, our AI suggests this action.</p>
          </div>
        </div>
        <h4 className="text-xl font-semibold mb-2">{nextStep.title}</h4>
        <p className="text-gray-400 mb-6">{nextStep.description}</p>
        <Link 
          href={nextStep.href}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transform transition-all duration-300"
        >
          {nextStep.action}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, authenticated } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  const [stats, setStats] = useState({ connections: 0, pendingRequests: 0, messages: 0, upcomingSessions: 0 });
  const [recommendedSeniors, setRecommendedSeniors] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [curatedBlog, setCuratedBlog] = useState(null);
  const [lastReadBlog, setLastReadBlog] = useState(null);
  const [learningResource, setLearningResource] = useState(null);
  const [learningLoading, setLearningLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!authenticated) return;

    setDashboardLoading(true);
    // Don't use executeApiCall for individual API calls to prevent cascading failures
    try {
      const authHeaders = getAuthHeaders();
      
      // Fetch stats
      try {
        const statsResponse = await axios.get('/api/users/stats', authHeaders);
        setStats(statsResponse.data);
      } catch (statsError) {
        console.error('Error fetching stats:', statsError);
        // Set fallback values instead of failing
        setStats({ connections: 0, pendingRequests: 0, messages: 0, upcomingSessions: 0 });
      }

      // Fetch upcoming sessions
      try {
        const sessionsResponse = await axios.get('/api/sessions?upcoming=true&limit=3');
        setUpcomingSessions(sessionsResponse.data?.sessions || []);
        setStats(prev => ({ ...prev, upcomingSessions: sessionsResponse.data?.sessions?.length || 0 }));
      } catch (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        setUpcomingSessions([]);
        // Don't fail the whole dashboard if sessions API fails
      }

      // Fetch recommended seniors for junior users
      if (user?.role === 'junior') {
        try {
          const response = await axios.get('/api/users/seniors?limit=3', authHeaders);
          setRecommendedSeniors(response.data?.seniors || []);
        } catch (seniorsError) {
          console.error('Error fetching recommended seniors:', seniorsError);
          setRecommendedSeniors([]);
          // Don't fail the whole dashboard if seniors API fails
        }
      }

      // Fetch one blog for AI-curated reading (static selection for now)
      try {
        const blogsResponse = await fetch('/api/blogs');
        if (blogsResponse.ok) {
          const blogs = await blogsResponse.json();
          setCuratedBlog(Array.isArray(blogs) ? blogs[0] : null);
        } else {
          setCuratedBlog(null);
        }
      } catch (blogsError) {
        console.error('Error fetching curated blog:', blogsError);
        setCuratedBlog(null);
      }
    } catch (error) {
      console.error('Unexpected error in fetchDashboardData:', error);
      // Set fallback values for everything
      setStats({ connections: 0, pendingRequests: 0, messages: 0, upcomingSessions: 0 });
      setUpcomingSessions([]);
      setRecommendedSeniors([]);
      setCuratedBlog(null);
    } finally {
      setDashboardLoading(false);
    }
  }, [authenticated, user]);

  useEffect(() => {
    if (authenticated) {
      fetchDashboardData();
    } else if (!authLoading) {
      router.push('/login');
    }
  }, [authenticated, authLoading, fetchDashboardData, router]);

  // Load most recently read blog from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sj_last_read_blog');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.slug) setLastReadBlog(parsed);
    } catch (_) {}
  }, []);

  // Fetch a single most relevant resource for the last read blog
  useEffect(() => {
    let aborted = false;
    async function run() {
      if (!lastReadBlog?.slug) return;
      setLearningLoading(true);
      try {
        const res = await fetch(`/api/blogs/${lastReadBlog.slug}/related-resources?limit=3`);
        if (!res.ok) throw new Error('Failed to load related resources');
        const data = await res.json();
        if (aborted) return;
        const items = Array.isArray(data?.resources) ? data.resources : [];
        setLearningResource(items[0] || null);
      } catch (e) {
        if (!aborted) setLearningResource(null);
      } finally {
        if (!aborted) setLearningLoading(false);
      }
    }
    run();
    return () => {
      aborted = true;
    };
  }, [lastReadBlog?.slug]);

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A0B2E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  return (
    <div className="relative z-10 min-h-screen bg-[#1A0B2E]">
      <div className="min-h-screen text-white pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero / Welcome Section */}
        <header className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Welcome back, {user.username}!</h1>
              <p className="text-xl text-gray-400">
                {user.role === 'junior' 
                  ? "Ready to level up your skills? Let's connect you with experienced mentors." 
                  : "Ready to share your knowledge? Let's help junior developers grow."
                }
              </p>
            </div>
            <Link
              href={user?.id ? `/profile/${user.id}` : '/profile/edit'}
              className="px-6 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Profile
            </Link>
          </div>
        </header>

        {/* Stats Cards Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<Users size={28} />} 
              title="Total Connections" 
              value={stats.connections}
              helperText={stats.connections === 0 ? "AI-Recommended: start connecting" : "Based on learning signals: keep going"}
            />
            <StatCard 
              icon={<Mail size={28} />} 
              title="Pending Requests" 
              value={stats.pendingRequests}
              helperText={stats.pendingRequests === 0 ? "No pending requests" : "Based on learning signals: awaiting response"}
            />
            <StatCard 
              icon={<Calendar size={28} />} 
              title="Upcoming Sessions" 
              value={stats.upcomingSessions}
              helperText={stats.upcomingSessions === 0 ? "AI-Recommended: book your first session" : "Get ready!"}
            />
            <StatCard 
              icon={<Mail size={28} />} 
              title="Unread Messages" 
              value={stats.messages}
              helperText={stats.messages === 0 ? "All caught up" : "New messages"}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-6 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">🤖 AI Insight (Stage-based)</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  At your current stage, most juniors grow faster by combining focused reading with one practical action.
                </p>
              </div>
              <div className="shrink-0 rounded-full border border-white/10 bg-white/5 p-3 text-white/70">
                <Zap size={18} />
              </div>
            </div>
          </motion.div>

          {/* AI Learning Signal */}
          {(lastReadBlog?.slug || learningLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-4 rounded-2xl border border-indigo-500/20 bg-slate-900/40 backdrop-blur-md ring-1 ring-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.12)]"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">🤖 AI Learning Signal</h3>
                    <p className="mt-1 text-sm text-white/65">Based on what you explored recently, this is the next best step.</p>
                  </div>
                  <div className="shrink-0 rounded-full border border-white/10 bg-white/5 p-3 text-white/70">
                    <Zap size={18} />
                  </div>
                </div>

                {learningLoading ? (
                  <div className="h-24 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                ) : learningResource ? (
                  <div className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/7.5 transition-colors">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">{learningResource.type}</span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">{learningResource.difficulty}</span>
                      </div>
                      <h4 className="text-white font-semibold text-base leading-snug mb-1">{learningResource.title}</h4>
                      {learningResource.description && (
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">{learningResource.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/50">From your last read: {lastReadBlog?.title}</div>
                        <a
                          href={learningResource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-sm hover:bg-indigo-500/30 hover:text-white transition"
                        >
                          Explore Resource
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">No immediate action suggested yet. Keep exploring.</p>
                )}
              </div>
            </motion.div>
          )}
        </section>

        {/* Your Next Step Highlight Card */}
        <section className="mb-12">
          <NextStepCard user={user} stats={stats} />
        </section>

        {/* Upcoming Sessions Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
            <Link href="/schedule" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View All →
            </Link>
          </div>
          {upcomingSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => (
                <motion.div
                  key={session._id}
                  className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-500/20 p-3 rounded-full">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{session.mentorId?.username || 'Session'}</h3>
                      <p className="text-gray-400 text-sm">{session.sessionDate} at {session.sessionTime}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{session.notes || 'Mentoring session'}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
              <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No upcoming sessions</h3>
              <p className="text-gray-400 mb-6">Book your first mentoring session to get started</p>
              <Link 
                href="/schedule"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transform transition-all duration-300"
              >
                Schedule Session
              </Link>
            </div>
          )}
        </section>

        {/* AI-Curated Reading */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">AI-Curated Reading</h2>
              <p className="text-sm text-gray-400 mt-1">Handpicked to improve your next technical decision.</p>
            </div>
            <Link href="/blog" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View All →
            </Link>
          </div>

          <CuratedReadingCard blog={curatedBlog} />
        </section>

        {/* Recommended Senior Developers Section */}
        {user.role === 'junior' && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">AI-Recommended Senior Developers</h2>
              <Link href="/seniors" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                Browse All →
              </Link>
            </div>
            {recommendedSeniors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedSeniors.map((senior) => <SeniorDeveloperCard key={senior._id} senior={senior} />)}
              </div>
            ) : (
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
                <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">No senior developers available</h3>
                <p className="text-gray-400">Check back later for new mentor opportunities</p>
              </div>
            )}
          </section>
        )}

        {/* Quick Actions Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard 
              icon={<Search size={28} />} 
              title="Find Developers" 
              description={`Connect with ${user.role === 'junior' ? 'senior' : 'junior'} developers`} 
              href={user.role === 'junior' ? '/seniors' : '/juniors'} 
            />
            <QuickActionCard 
              icon={<Calendar size={28} />} 
              title="Schedule Session" 
              description="Book a mentoring session" 
              href="/schedule" 
            />
            <QuickActionCard 
              icon={<Mail size={28} />} 
              title="Messages" 
              description="Check your conversations" 
              href="/messages" 
            />
            <QuickActionCard 
              icon={<BookOpen size={28} />} 
              title="Learning Resources" 
              description="Access learning materials" 
              href="/resources" 
            />
          </div>
        </section>

        {/* Recent Activity Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="space-y-4">
              {stats.connections > 0 && (
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="font-medium">New connection established</p>
                    <p className="text-gray-400 text-sm">You connected with a developer</p>
                  </div>
                </div>
              )}
              {stats.pendingRequests > 0 && (
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="bg-yellow-500/20 p-2 rounded-full">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Connection request received</p>
                    <p className="text-gray-400 text-sm">Someone wants to connect with you</p>
                  </div>
                </div>
              )}
              {stats.messages > 0 && (
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="bg-blue-500/20 p-2 rounded-full">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="font-medium">New message received</p>
                    <p className="text-gray-400 text-sm">You have unread messages</p>
                  </div>
                </div>
              )}
              {stats.connections === 0 && stats.pendingRequests === 0 && stats.messages === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent activity. Start by connecting with other developers!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
