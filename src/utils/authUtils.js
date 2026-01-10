'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

/**
 * Custom hook to protect client-side routes that require authentication
 * @param {Object} options - Configuration options
 * @param {Array} options.allowedRoles - Array of roles allowed to access the route
 * @returns {Object} - Authentication state and user data
 */
export function useAuth(options = {}) {
  const { allowedRoles = [] } = options;
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  
  // Use a ref to track if authentication check has been performed
  const authCheckPerformed = useRef(false);

  // Memoize the checkAuth function to prevent it from changing on every render
  const checkAuth = useCallback(async () => {
    // Skip if auth check has already been performed
    if (authCheckPerformed.current) return;
    
    let isMounted = true;
    
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        // No token found
        if (isMounted) {
          setLoading(false);
          setAuthenticated(false);
        }
        return;
      }

      // Get user data from localStorage or fetch from API
      let userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      
      if (userData) {
        try {
          userData = JSON.parse(userData);
          
          // Check if user has required role
          if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
            if (isMounted) {
              setError('Access denied. You do not have permission to access this page.');
              setLoading(false);
            }
            return;
          }
          
          if (isMounted) {
            setUser(userData);
            setAuthenticated(true);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
          // If parsing fails, fetch from API
          userData = null;
        }
      }

      // If no user data in localStorage, fetch from API
      if (!userData) {
        try {
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Check if user has required role
          if (allowedRoles.length > 0 && !allowedRoles.includes(response.data.user.role)) {
            if (isMounted) {
              setError('Access denied. You do not have permission to access this page.');
              setLoading(false);
            }
            return;
          }
          
          if (isMounted) {
            setUser(response.data.user);
            setAuthenticated(true);
            setLoading(false);
          }
          
          // Update localStorage with fresh user data
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          
          // Handle token expiration or invalid token
          if (err.response?.status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
            if (isMounted) {
              setLoading(false);
              setAuthenticated(false);
            }
            return;
          }
          
          if (isMounted) {
            setError('Error authenticating user. Please try again.');
            setLoading(false);
          }
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      if (isMounted) {
        setError('Authentication failed. Please login again.');
        setLoading(false);
      }
    }
    
    // Mark auth check as performed
    authCheckPerformed.current = true;
  }, [allowedRoles]); // Only include allowedRoles as dependency

  useEffect(() => {
    let isMounted = true;
    
    // Execute the auth check
    checkAuth();
    
    // Handle redirects based on authentication state
    if (!loading) {
      if (!authenticated && typeof window !== 'undefined') {
        router.push('/login');
      } else if (error && authenticated && typeof window !== 'undefined') {
        router.push('/dashboard');
      }
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [checkAuth, loading, authenticated, error, router]); // Include all dependencies

  return { user, loading, error, authenticated };
}

/**
 * Logout function to clear authentication data
 * @param {Function} callback - Optional callback function after logout
 */
export function logout(callback) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Optional: Call API to invalidate token on server
  try {
    axios.post('/api/auth/logout');
  } catch (err) {
    console.error('Error logging out:', err);
  }
  
  if (callback && typeof callback === 'function') {
    callback();
  }
}

/**
 * Function to set authentication data after login
 * @param {Object} data - Authentication data from API
 * @param {string} data.token - JWT token
 * @param {Object} data.user - User data
 */
export function setAuth(data) {
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
}

/**
 * Function to get authentication headers for API requests
 * @returns {Object} - Headers object with Authorization
 */
export function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token) {
    console.warn('No authentication token found in localStorage');
    return { headers: {} };
  }
  
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}
