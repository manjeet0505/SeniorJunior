'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth, getAuthHeaders } from '@/utils/authUtils';
import { motion } from 'framer-motion';
import { Users, Mail, Search, Calendar, BookOpen, Zap } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

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
            <h3 className="text-2xl font-bold text-purple-300">Your Next Step</h3>
            <p className="text-gray-300 text-sm">Recommended action for you</p>
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
    } catch (error) {
      console.error('Unexpected error in fetchDashboardData:', error);
      // Set fallback values for everything
      setStats({ connections: 0, pendingRequests: 0, messages: 0, upcomingSessions: 0 });
      setUpcomingSessions([]);
      setRecommendedSeniors([]);
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
    <AnimatedBackground variant="orbs">
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
            <Link href="/profile/edit" className="px-6 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300">
              Edit Profile
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
              helperText={stats.connections === 0 ? "Start connecting!" : "Keep growing!"}
            />
            <StatCard 
              icon={<Mail size={28} />} 
              title="Pending Requests" 
              value={stats.pendingRequests}
              helperText={stats.pendingRequests === 0 ? "No pending requests" : "Awaiting response"}
            />
            <StatCard 
              icon={<Calendar size={28} />} 
              title="Upcoming Sessions" 
              value={stats.upcomingSessions}
              helperText={stats.upcomingSessions === 0 ? "Book your first session" : "Get ready!"}
            />
            <StatCard 
              icon={<Mail size={28} />} 
              title="Unread Messages" 
              value={stats.messages}
              helperText={stats.messages === 0 ? "All caught up!" : "New messages"}
            />
          </div>
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

        {/* Recommended Senior Developers Section */}
        {user.role === 'junior' && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recommended Senior Developers</h2>
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
  </AnimatedBackground>
  );
}
