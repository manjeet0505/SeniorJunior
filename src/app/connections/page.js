'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth, getAuthHeaders } from '@/utils/authUtils';
import { useErrorHandler } from '@/utils/errorUtils';
import ErrorDisplay, { LoadingIndicator, SuccessDisplay } from '@/components/ui/ErrorDisplay';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import AppLayout from '@/components/layout/AppLayout';

export default function Connections() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError, authenticated } = useAuth();
  const { error, loading, executeApiCall, handleError, clearError, setSuccess } = useErrorHandler();
  
  const [activeTab, setActiveTab] = useState('pending');
  const [connections, setConnections] = useState([]);
  const [success, setSuccessMessage] = useState('');

  useEffect(() => {
    // Only fetch connections data if user is authenticated
    if (authenticated && user) {
      fetchConnections(activeTab);
    }
  }, [authenticated, user, activeTab]);

  const fetchConnections = async (status) => {
    try {
      await executeApiCall(async () => {
        const authHeaders = getAuthHeaders();
        
        // For pending connections, we want to see received requests
        const type = status === 'pending' ? 'received' : null;
        
        const response = await axios.get(
          `/api/connections?status=${status}${type ? `&type=${type}` : ''}`, 
          authHeaders
        );
        
        setConnections(response.data.connections);
      });
    } catch (err) {
      handleError(err);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      await executeApiCall(async () => {
        const authHeaders = getAuthHeaders();
        
        await axios.put(`/api/connections/${connectionId}/accept`, {}, authHeaders);
        
        // Show success message
        setSuccessMessage('Connection request accepted successfully!');
        
        // Refresh the connections list
        fetchConnections(activeTab);
      });
    } catch (err) {
      handleError(err);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await executeApiCall(async () => {
        const authHeaders = getAuthHeaders();
        
        await axios.put(`/api/connections/${connectionId}/reject`, {}, authHeaders);
        
        // Show success message
        setSuccessMessage('Connection request declined.');
        
        // Refresh the connections list
        fetchConnections(activeTab);
      });
    } catch (err) {
      handleError(err);
    }
  };

  const getOtherUser = (connection) => {
    if (!user) return null;
    
    return connection.requesterId._id === user.id 
      ? connection.recipientId 
      : connection.requesterId;
  };

  // Show loading state while authentication or data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator message="Loading connections..." />
      </div>
    );
  }

  // Show error state if authentication or data fetching failed
  if (authError || error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorDisplay error={authError || error} />
      </div>
    );
  }
  
  // If not authenticated, don't render
  if (!authenticated || !user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Your Connections</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Manage your network of developers</p>
          </header>

          {success && (
            <div className="mb-6 bg-green-500/20 backdrop-blur-lg border border-green-400/50 p-4 rounded-lg">
              <p className="text-green-400">{success}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-white/20 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('pending')}
                className={`${
                  activeTab === 'pending'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`${
                  activeTab === 'accepted'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Connected
              </button>
            </nav>
          </div>

          {/* Connection Cards */}
          {connections.length === 0 ? (
            <div className="text-center py-12 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">No connections found</h3>
              <p className="text-sm text-gray-400 mb-6">
                {activeTab === 'pending'
                  ? 'You have no pending connection requests.'
                  : 'You have not connected with any developers yet.'}
              </p>
              <Link
                href={user.role === 'junior' ? '/seniors' : '/juniors'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transform transition-all duration-300"
              >
                Find {user.role === 'junior' ? 'Senior' : 'Junior'} Developers
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {connections.map((connection) => {
                const otherUser = getOtherUser(connection);
                
                return (
                  <div key={connection._id} className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {otherUser.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-white">{otherUser.username}</h3>
                          <p className="text-sm text-gray-400">{otherUser.role}</p>
                        </div>
                        <div>
                          {activeTab === 'pending' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              Connected
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-300 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {otherUser.skills && otherUser.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-300 mb-2">Bio</p>
                        <p className="text-sm text-gray-400 line-clamp-3">
                          {otherUser.bio || 'No bio provided.'}
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link
                          href={`/profile/${otherUser._id}`}
                          className="flex-1 flex justify-center py-2 px-4 border border-purple-500 rounded-full text-sm font-medium text-purple-400 hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          View Profile
                        </Link>
                        
                        {activeTab === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleAccept(connection._id)}
                              className="flex-1 flex justify-center py-2 px-4 border border-green-500 rounded-full text-sm font-medium text-green-400 hover:bg-green-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(connection._id)}
                              className="flex-1 flex justify-center py-2 px-4 border border-red-500 rounded-full text-sm font-medium text-red-400 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/chat/${connection._id}`}
                            className="flex-1 flex justify-center py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium hover:scale-105 transform transition-all duration-300"
                          >
                            Message
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
