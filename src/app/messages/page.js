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
      <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Messages</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Your conversations with mentors and mentees</p>
          </header>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Messages</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Your conversations with other developers</p>
        </header>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/50 p-4 mb-8 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {conversations.length === 0 ? (
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="text-lg font-medium text-white mb-2">No conversations</h3>
            <p className="text-gray-400 mb-6">
              You don't have any conversations yet. Start by connecting with other developers!
            </p>
            <Link
              href="/connections"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transform transition-all duration-300"
            >
              Find Connections
            </Link>
          </div>
        ) : (
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <ul className="divide-y divide-white/10">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <Link
                    href={`/chat/${conversation.id}`}
                    className="block hover:bg-white/5 px-6 py-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                          <span className="text-lg font-medium text-white">
                            {conversation.otherUser.username.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-white">
                              {conversation.otherUser.username}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-white">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 truncate">
                            {conversation.latestMessage ? (
                              conversation.latestMessage.senderId === user?.id ? (
                                <span className="text-gray-500">You: </span>
                              ) : null
                            ) : null}
                            {conversation.latestMessage ? 
                              conversation.latestMessage.content : 
                              'Start a conversation'}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                        <p className="text-xs text-gray-400">
                          {conversation.timestamp ? formatTime(conversation.timestamp) : ''}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="h-2 w-2 rounded-full bg-purple-600 mt-1"></div>
                        )}
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
