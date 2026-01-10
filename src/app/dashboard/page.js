'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth, getAuthHeaders } from '@/utils/authUtils';
import { useErrorHandler } from '@/utils/errorUtils';
import ErrorDisplay, { LoadingIndicator, SuccessDisplay } from '@/components/ui/ErrorDisplay';
import ResponsiveContainer, { ResponsiveGrid } from '@/components/ui/ResponsiveContainer';
// Removed AppLayout import to prevent duplicate navbar

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError, authenticated } = useAuth();
  const { error, loading, executeApiCall, handleError, clearError } = useErrorHandler();
  
  // Use refs to track if data has been loaded and prevent infinite loops
  const dataLoaded = useRef(false);
  const dataFetchAttempted = useRef(false);
  
  const [stats, setStats] = useState({
    connections: 0,
    pendingRequests: 0,
    messages: 0
  });
  const [recentConnections, setRecentConnections] = useState([]);
  const [recommendedSeniors, setRecommendedSeniors] = useState([]);

  // Memoize the fetchDashboardData function to prevent infinite loops
  const fetchDashboardData = useCallback(async () => {
    // Skip if data fetch has been attempted or data has already been loaded
    if (dataFetchAttempted.current) return;
    
    // Mark that we've attempted to fetch data
    dataFetchAttempted.current = true;
    
    try {
      // First verify we have a valid token
      const token = localStorage.getItem('token');
      
      // For development, allow mock token
      if (!token && process.env.NODE_ENV === 'development') {
        console.log('Development mode: Using mock token');
        const mockToken = 'mock-token-for-development';
        localStorage.setItem('token', mockToken);
        
        // Set mock user if not present
        if (!localStorage.getItem('user')) {
          const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            username: 'dev_user',
            email: 'dev@example.com',
            role: 'senior'
          };
          localStorage.setItem('user', JSON.stringify(mockUser));
        }
      } else if (!token) {
        console.error('No authentication token found');
        router.push('/login');
        return;
      }
      
      await executeApiCall(async () => {
        const authHeaders = getAuthHeaders();
        
        // Verify the user is authenticated by fetching user data
        try {
          const response = await axios.get('/api/users/me', {
            ...authHeaders,
            timeout: 8000,
            validateStatus: function (status) {
              // Consider all status codes as successful to handle them manually
              return true;
            }
          });
          
          // Handle non-200 responses
          if (response.status !== 200) {
            console.warn(`Authentication check returned status ${response.status}`);
            
            // In development mode, continue anyway with mock data
            if (process.env.NODE_ENV === 'development') {
              console.log('Development mode: Continuing despite auth error');
              // Continue with dashboard data fetch
            } else if (response.status === 401) {
              // Clear invalid auth data and redirect to login
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/login');
              return;
            }
          }
        } catch (authError) {
          console.error('Authentication error:', authError);
          
          // In development mode, continue anyway with mock data
          if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Continuing despite auth error');
            // Continue with dashboard data fetch
          } else {
            // Clear invalid auth data and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
            return;
          }
        }
        
        try {
          // Fetch stats data from API
          const statsResponse = await axios.get('/api/users/stats', authHeaders);
          setStats(statsResponse.data);
        } catch (statsError) {
          console.error('Error fetching stats:', statsError);
          // Set default stats if API fails
          setStats({
            connections: 0,
            pendingRequests: 0,
            messages: 0
          });
        }
        
        try {
          // Fetch recent connections
          const connectionsResponse = await axios.get('/api/connections?status=accepted&limit=3', authHeaders);
          setRecentConnections(connectionsResponse.data?.connections || []);
        } catch (connectionsError) {
          console.error('Error fetching connections:', connectionsError);
          setRecentConnections([]);
        }
        
        // Fetch recommended seniors for junior developers
        if (user?.role === 'junior') {
          try {
            const response = await axios.get('/api/users/seniors?limit=3', authHeaders);
            setRecommendedSeniors(response.data?.seniors || []);
          } catch (seniorsError) {
            console.error('Error fetching recommended seniors:', seniorsError);
            setRecommendedSeniors([]);
          }
        }
        
        // Mark data as loaded to prevent repeated API calls
        dataLoaded.current = true;
      });
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      handleError(err);
    }
  }, [executeApiCall, handleError, user, router]);

  // Use a separate effect for data fetching to prevent infinite loops
  useEffect(() => {
    // Only fetch dashboard data if:
    // 1. User is authenticated
    // 2. Authentication loading is complete
    // 3. We have a user object
    // 4. We haven't attempted to fetch data yet
    if (authenticated && !authLoading && user && !dataFetchAttempted.current) {
      fetchDashboardData();
    } else if (!authenticated && !authLoading) {
      // If not authenticated and not loading, redirect to login
      router.push('/login');
    }
  }, [authenticated, authLoading, user, fetchDashboardData, router]);

  // fetchDashboardData is defined above using useCallback

  // Show loading state while authentication or data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator message="Loading dashboard..." />
      </div>
    );
  }

  // Show error state if authentication or data fetching failed
  if (authError) {
    // If authentication error, redirect to login
    router.push('/login');
    return null;
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorDisplay error={authError || error} />
      </div>
    );
  }
  
  // If not authenticated, don't render the dashboard
  if (!authenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-fade-in">
      <div className="py-10">
        <ResponsiveContainer>
          {/* Dashboard Header */}
          <header className="mb-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="animate-slide-in-left">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {user.username}!
                </p>
              </div>
              <div className="animate-slide-in-right">
                <Link
                  href="/profile/edit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:scale-105 transform transition-all duration-200"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </header>

          {/* Statistics Section */}
          <div className="mb-10 animate-fade-in animation-delay-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg card-hover animate-scale-in">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Connections</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.connections}</div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg card-hover animate-scale-in animation-delay-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg card-hover animate-scale-in animation-delay-400">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">Unread Messages</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.messages}</div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Connections */}
          {recentConnections.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Connections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentConnections.map((connection) => {
                  const connectionUser = connection.requesterId._id === user.id
                    ? connection.recipientId
                    : connection.requesterId;
                  
                  return (
                    <div key={connection._id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-800 font-medium">
                                {connectionUser.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{connectionUser.username}</h3>
                            <p className="text-sm text-gray-500">{connectionUser.role}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {connectionUser.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {skill}
                              </span>
                            ))}
                            {connectionUser.skills.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{connectionUser.skills.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-3">
                            <Link
                              href={`/profile/${connectionUser._id}`}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              View Profile
                            </Link>
                            <Link
                              href={`/chat/${connection._id}`}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Message
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Senior Developers (for junior developers only) */}
          {user.role === 'junior' && recommendedSeniors.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Senior Developers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedSeniors.map((senior) => (
                  <div key={senior._id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-800 font-medium">
                              {senior.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{senior.username}</h3>
                          <p className="text-sm text-gray-500">Senior Developer</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {senior.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {senior.skills.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{senior.skills.length - 3} more
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/profile/${senior._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Find Developers</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Connect with {user.role === 'junior' ? 'senior' : 'junior'} developers
                  </p>
                  <div className="mt-3">
                    <Link
                      href={user.role === 'junior' ? '/seniors' : '/juniors'}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Find
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Schedule Session</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Book a mentoring session
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/schedule"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Schedule
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Learning Resources</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Access learning materials
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/resources"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Skill Assessment</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Test your coding skills
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/assessment"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
