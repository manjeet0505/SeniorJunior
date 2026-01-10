'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/utils/socketUtils';
import { useAuth, getAuthHeaders } from '@/utils/authUtils';
import { useErrorHandler } from '@/utils/errorUtils';
import { LoadingIndicator } from '@/components/ui/ErrorDisplay';
import axios from 'axios';

/**
 * Chat interface component for real-time messaging
 * @param {Object} props - Component props
 * @param {string} props.conversationId - ID of the conversation
 * @param {Object} props.recipient - Recipient user object
 * @returns {React.ReactNode} - Rendered component
 */
export default function ChatInterface({ conversationId, recipient }) {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [historyMessages, setHistoryMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { error, handleError } = useErrorHandler();
  const messagesEndRef = useRef(null);
  
  // Get token for socket connection
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Use chat hook for real-time messaging
  const { 
    messages: socketMessages, 
    sendMessage, 
    markAsRead, 
    sendTypingIndicator,
    isSomeoneTyping,
    typingUsers
  } = useChat(token ? { auth: { token } } : null, conversationId);
  
  // Combine history messages and socket messages
  const allMessages = [...historyMessages, ...socketMessages];
  
  // Fetch message history
  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await axios.get(`/api/messages/${conversationId}`, getAuthHeaders());
        setHistoryMessages(response.data.messages);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    if (conversationId) {
      fetchMessageHistory();
    }
  }, [conversationId, handleError]);
  
  // Mark messages as read when they are received
  useEffect(() => {
    if (user && conversationId && socketMessages.length > 0) {
      const unreadMessages = socketMessages.filter(
        msg => !msg.read && msg.senderId !== user.id
      );
      
      if (unreadMessages.length > 0) {
        markAsRead(user.id);
      }
    }
  }, [socketMessages, user, conversationId, markAsRead]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);
  
  // Handle message input change
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    // Send typing indicator
    if (e.target.value.length > 0) {
      sendTypingIndicator(true);
    } else {
      sendTypingIndicator(false);
    }
  };
  
  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // Send message
    sendMessage(messageInput.trim(), recipient.id);
    
    // Clear input
    setMessageInput('');
    
    // Stop typing indicator
    sendTypingIndicator(false);
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for message groups
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };
  
  const messageGroups = groupMessagesByDate(allMessages);
  
  // Loading state
  if (isLoadingHistory) {
    return <LoadingIndicator message="Loading conversation..." />;
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-800 font-medium">
              {recipient?.username?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{recipient?.username || 'User'}</p>
          <p className="text-xs text-gray-500">{recipient?.role || 'Developer'}</p>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messageGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="h-12 w-12 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-200 rounded-full px-3 py-1">
                  <p className="text-xs text-gray-600">{formatDate(new Date(group.date))}</p>
                </div>
              </div>
                           {group.messages.map((message, index) => {
                // Support both populated and non-populated senderId
                const sender = typeof message.senderId === 'object' && message.senderId !== null
                  ? message.senderId
                  : { _id: message.senderId, username: message.senderUsername || 'User' };
                const isCurrentUser = sender._id === user?.id;
                const avatarBg = isCurrentUser ? 'bg-indigo-600' : 'bg-gray-300';
                const avatarText = isCurrentUser ? 'text-white' : 'text-indigo-700';
                return (
                  <div
                    key={message._id || index}
                    className={`flex items-end mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Avatar for sender */}
                    {!isCurrentUser && (
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${avatarBg} flex items-center justify-center mr-2`}>
                        <span className={`font-bold uppercase ${avatarText}`}>{sender.username?.charAt(0) || '?'}</span>
                      </div>
                    )}
                    <div>
                      <div
                        className={`rounded-2xl px-4 py-2 max-w-xs lg:max-w-md shadow-md ${
                          isCurrentUser
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        {/* Username above message if not current user */}
                        {!isCurrentUser && (
                          <div className="text-xs font-semibold text-indigo-700 mb-1">{sender.username}</div>
                        )}
                        <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                        <div className={`text-xs mt-1 flex justify-between items-center ${
                          isCurrentUser ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {isCurrentUser && (
                            <span className="ml-2">
                              {message.read ? (
                                <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Avatar for current user */}
                    {isCurrentUser && (
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${avatarBg} flex items-center justify-center ml-2`}>
                        <span className={`font-bold uppercase ${avatarText}`}>{sender.username?.charAt(0) || '?'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        
        {/* Typing indicator */}
        {isSomeoneTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
