'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function UserProfile() {
  const params = useParams();
  const router = useRouter();
  const { userId } = params;
  
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    // Parse current user data
    try {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
      
      // Fetch profile data
      fetchUserProfile(userId, token);
      
      // Check connection status if viewing someone else's profile
      if (parsedUser.id !== userId) {
        checkConnectionStatus(parsedUser.id, userId, token);
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      setError('Error loading profile. Please login again.');
      setLoading(false);
    }
  }, [userId, router]);

  const fetchUserProfile = async (id, token) => {
    try {
      const response = await axios.get(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.response?.data?.error || 'Failed to load user profile.');
      setLoading(false);
    }
  };

  const checkConnectionStatus = async (currentUserId, targetUserId, token) => {
    try {
      const response = await axios.get(`/api/connections/status?fromId=${currentUserId}&toId=${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setConnectionStatus(response.data.status);
    } catch (err) {
      console.error('Error checking connection status:', err);
      // Don't set error state here as it's not critical
    }
  };

  const handleConnect = async () => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('Sending connection request to:', userId);
      
      await axios.post('/api/connections', {
        recipientId: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setConnectionStatus('pending');
      alert('Connection request sent successfully!');
    } catch (err) {
      console.error('Error sending connection request:', err);
      setError(err.response?.data?.error || 'Failed to send connection request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-indigo-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === userId;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {user.username}'s Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {user.role === 'senior' ? 'Senior Developer' : 'Junior Developer'}
              </p>
            </div>
            {isOwnProfile ? (
              <Link 
                href="/profile/edit" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Profile
              </Link>
            ) : (
              <div>
                {connectionStatus === 'connected' && (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                )}
                {connectionStatus === 'pending' && (
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Connection Pending
                  </span>
                )}
                {!connectionStatus && (
                  <button
                    onClick={handleConnect}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Connect
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Username
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.username}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Role
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.role === 'senior' ? 'Senior Developer' : 'Junior Developer'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Skills
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.map((skill, index) => (
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
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Bio
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.bio || 'No bio provided.'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {connectionStatus === 'connected' && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Contact {user.username}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Send a message to start a conversation
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <Link
                href={`/messages/${userId}`}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Message {user.username}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
