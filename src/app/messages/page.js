'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Messages() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Fetch conversations
      fetchConversations(token, parsedUser.id);
    } catch (err) {
      console.error('Error parsing user data:', err);
      setError('Error loading user data. Please login again.');
      setLoading(false);
    }
  }, [router]);

  const fetchConversations = async (token, userId) => {
    setLoading(true);
    try {
      // Get all accepted connections
      const connectionsResponse = await axios.get('/api/connections?status=accepted', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const connections = connectionsResponse.data.connections;
      
      // Get the latest message for each connection to display in the conversation list
      const conversationsWithMessages = await Promise.all(
        connections.map(async (connection) => {
          const otherUserId = connection.requesterId._id === userId 
            ? connection.recipientId._id 
            : connection.requesterId._id;
          
          const otherUser = connection.requesterId._id === userId 
            ? connection.recipientId 
            : connection.requesterId;
          
          // Create conversation ID (sorted user IDs joined by underscore)
          const conversationId = [userId, otherUserId].sort().join('_');
          
          try {
            // Get the latest message
            const messagesResponse = await axios.get(`/api/messages/${conversationId}?limit=1`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            const latestMessage = messagesResponse.data.messages[0] || null;
            
            // Count unread messages
            const unreadCount = messagesResponse.data.messages.filter(
              msg => msg.receiverId === userId && !msg.read
            ).length;
            
            return {
              id: conversationId,
              otherUser,
              latestMessage,
              unreadCount,
              timestamp: latestMessage ? new Date(latestMessage.timestamp) : new Date(connection.createdAt)
            };
          } catch (err) {
            console.error(`Error fetching messages for conversation ${conversationId}:`, err);
            
            // Return conversation without messages
            return {
              id: conversationId,
              otherUser,
              latestMessage: null,
              unreadCount: 0,
              timestamp: new Date(connection.createdAt)
            };
          }
        })
      );
      
      // Sort conversations by latest message timestamp (most recent first)
      const sortedConversations = conversationsWithMessages.sort((a, b) => 
        b.timestamp - a.timestamp
      );
      
      setConversations(sortedConversations);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.response?.data?.error || 'Failed to load conversations.');
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If the message is from today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If the message is from this week, show day name
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-in-left">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">Your conversations with mentors and mentees</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-slide-in-left">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Messages
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your conversations with other developers
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {conversations.length === 0 ? (
          <ul className="divide-y divide-gray-200 bg-white shadow overflow-hidden sm:rounded-md animate-fade-in animation-delay-400">
            <div className="text-center py-12 animate-scale-in animation-delay-600">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any conversations yet. Start by connecting with other developers!
              </p>
              <div className="mt-6">
                <Link
                  href="/connections"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:scale-105 transform transition-all duration-200"
                >
                  Find Connections
                </Link>
              </div>
            </div>
          </ul>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <Link
                    href={`/chat/${conversation.id}`}
                    className="block hover:bg-gray-50 px-4 py-4 sm:px-6 card-hover"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-indigo-600">
                              {conversation.otherUser.username.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-sm font-medium text-gray-900">
                                {conversation.otherUser.username}
                              </h3>
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.latestMessage ? (
                                conversation.latestMessage.senderId === user?.id ? (
                                  <span className="text-gray-400">You: </span>
                                ) : null
                              ) : null}
                              {conversation.latestMessage ? 
                                conversation.latestMessage.content : 
                                'Start a conversation'}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                          <p className="text-xs text-gray-500">
                            {conversation.timestamp ? formatTime(conversation.timestamp) : ''}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <div className="h-2 w-2 rounded-full bg-indigo-600 mt-1"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
