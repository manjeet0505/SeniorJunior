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
      <div className="py-10 bg-gray-50 min-h-screen">
        <ResponsiveContainer>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Your Connections
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Manage your network of developers
            </p>
          </div>

          {success && (
            <div className="mb-6">
              <SuccessDisplay message={success} onDismiss={() => setSuccessMessage('')} />
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('pending')}
                className={`${
                  activeTab === 'pending'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`${
                  activeTab === 'accepted'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Connected
              </button>
            </nav>
          </div>

          {/* Connection Cards */}
          {connections.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No connections found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'pending'
                  ? 'You have no pending connection requests.'
                  : 'You have not connected with any developers yet.'}
              </p>
              <div className="mt-6">
                <Link
                  href={user.role === 'junior' ? '/seniors' : '/juniors'}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Find {user.role === 'junior' ? 'Senior' : 'Junior'} Developers
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {connections.map((connection) => {
                const otherUser = getOtherUser(connection);
                
                return (
                  <div key={connection._id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-800 font-medium">
                              {otherUser.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{otherUser.username}</h3>
                          <p className="text-sm text-gray-500">{otherUser.role}</p>
                        </div>
                        <div>
                          {activeTab === 'pending' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Connected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Skills
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <div className="flex flex-wrap gap-2">
                              {otherUser.skills && otherUser.skills.map((skill, index) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Bio
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {otherUser.bio || 'No bio provided.'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-4">
                      <div className="flex space-x-3">
                        <Link
                          href={`/profile/${otherUser._id}`}
                          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Profile
                        </Link>
                        
                        {activeTab === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleAccept(connection._id)}
                              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(connection._id)}
                              className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/chat/${connection._id}`}
                            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        </ResponsiveContainer>
      </div>
    </AppLayout>
  );
}
