'use client';

import { io } from 'socket.io-client';
import { useState, useEffect, useRef, useCallback } from 'react';

// Socket instance that will be reused across the application
let socket = null;

/**
 * Initialize socket connection
 * @param {string} token - JWT token for authentication
 * @returns {Object} - Socket instance
 */
export const initializeSocket = (token) => {
  if (!token) {
    console.error('No token provided for socket connection');
    return null;
  }

  // If socket already exists and is connected, return it
  if (socket && socket.connected) {
    return socket;
  }

  // Create new socket connection
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';
  
  socket = io(socketUrl, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  // Setup event listeners
  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

/**
 * Get the current socket instance
 * @returns {Object} - Socket instance
 */
export const getSocket = () => socket;

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Custom hook to use socket in React components
 * @param {string} token - JWT token for authentication
 * @returns {Object} - Socket instance and connection status
 */
export function useSocket(token) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // Initialize socket
    socketRef.current = initializeSocket(token);

    // Set up event listeners
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    if (socketRef.current) {
      socketRef.current.on('connect', onConnect);
      socketRef.current.on('disconnect', onDisconnect);

      // Check initial connection state
      setIsConnected(socketRef.current.connected);
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect', onConnect);
        socketRef.current.off('disconnect', onDisconnect);
      }
    };
  }, [token]);

  return { socket: socketRef.current, isConnected };
}

/**
 * Custom hook to handle online users
 * @param {Object} socket - Socket instance
 * @returns {Object} - Online users state and methods
 */
export function useOnlineUsers(socket) {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (!socket) return;

    // Handle initial online users list
    const handleOnlineUsers = ({ users }) => {
      setOnlineUsers(new Set(users));
    };

    // Handle user coming online
    const handleUserOnline = ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    };

    // Handle user going offline
    const handleUserOffline = ({ userId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set([...prev]);
        newSet.delete(userId);
        return newSet;
      });
    };

    // Set up event listeners
    socket.on('onlineUsers', handleOnlineUsers);
    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);

    // Cleanup function
    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
    };
  }, [socket]);

  // Check if a user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  return { onlineUsers, isUserOnline };
}

/**
 * Custom hook to handle connection notifications
 * @param {Object} socket - Socket instance
 * @returns {Object} - Connection notifications state and methods
 */
export function useConnectionNotifications(socket) {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connectionUpdates, setConnectionUpdates] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Handle new connection request
    const handleConnectionRequest = (data) => {
      setConnectionRequests(prev => [data, ...prev]);
    };

    // Handle connection status update
    const handleConnectionUpdated = (data) => {
      setConnectionUpdates(prev => [data, ...prev]);
    };

    // Set up event listeners
    socket.on('connectionRequest', handleConnectionRequest);
    socket.on('connectionUpdated', handleConnectionUpdated);

    // Cleanup function
    return () => {
      socket.off('connectionRequest', handleConnectionRequest);
      socket.off('connectionUpdated', handleConnectionUpdated);
    };
  }, [socket]);

  // Clear a connection request
  const clearConnectionRequest = useCallback((connectionId) => {
    setConnectionRequests(prev => prev.filter(req => req.connection._id !== connectionId));
  }, []);

  // Clear a connection update
  const clearConnectionUpdate = useCallback((connectionId) => {
    setConnectionUpdates(prev => prev.filter(update => update.connectionId !== connectionId));
  }, []);

  return {
    connectionRequests,
    connectionUpdates,
    clearConnectionRequest,
    clearConnectionUpdate
  };
}

/**
 * Custom hook to handle chat functionality
 * @param {Object} socket - Socket instance
 * @param {string} conversationId - ID of the conversation
 * @returns {Object} - Chat state and methods
 */
export function useChat(socket, conversationId) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join the conversation room
    socket.emit('joinRoom', conversationId);

    // Handle receiving a message
    const handleReceiveMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    // Handle typing indicator
    const handleUserTyping = ({ userId, isTyping }) => {
      if (isTyping) {
        setTypingUsers(prev => new Set([...prev, userId]));
      } else {
        setTypingUsers(prev => {
          const newSet = new Set([...prev]);
          newSet.delete(userId);
          return newSet;
        });
      }
    };

    // Handle messages being marked as read
    const handleMessagesRead = ({ userId }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.receiverId === userId ? { ...msg, read: true } : msg
        )
      );
    };

    // Set up event listeners
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('messagesRead', handleMessagesRead);

    // Cleanup function
    return () => {
      // Leave the conversation room
      socket.emit('leaveRoom', conversationId);
      
      // Remove event listeners
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, conversationId]);

  // Send a message
  const sendMessage = useCallback((content, receiverId) => {
    if (!socket || !conversationId) return;

    socket.emit('sendMessage', {
      receiverId,
      content,
      conversationId
    });
  }, [socket, conversationId]);

  // Mark messages as read
  const markAsRead = useCallback((userId) => {
    if (!socket || !conversationId) return;

    socket.emit('markAsRead', {
      conversationId,
      userId
    });
  }, [socket, conversationId]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    if (!socket || !conversationId) return;

    socket.emit('typing', {
      conversationId,
      isTyping
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If user is typing, set timeout to automatically stop typing indicator after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          conversationId,
          isTyping: false
        });
      }, 3000);
    }
  }, [socket, conversationId]);

  // Check if someone is typing
  const isSomeoneTyping = typingUsers.size > 0;

  return {
    messages,
    sendMessage,
    markAsRead,
    sendTypingIndicator,
    isSomeoneTyping,
    typingUsers
  };
}
