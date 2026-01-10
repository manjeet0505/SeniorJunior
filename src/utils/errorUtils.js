'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook for API error handling
 * @returns {Object} - Error state and utility functions
 */
export function useErrorHandler() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle API error
  const handleError = useCallback((err) => {
    setLoading(false);
    
    if (axios.isAxiosError(err)) {
      // Handle Axios errors
      const status = err.response?.status;
      const message = err.response?.data?.error || err.response?.data?.message || err.message;
      
      // Handle authentication errors
      if (status === 401) {
        // Clear token and redirect to login if unauthorized
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      
      setError({
        status,
        message,
        isAxiosError: true
      });
    } else {
      // Handle other errors
      setError({
        message: err.message || 'An unexpected error occurred',
        isAxiosError: false
      });
    }
    
    return err;
  }, []);

  // Execute API call with error handling
  const executeApiCall = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [handleError]);

  return {
    error,
    loading,
    clearError,
    handleError,
    executeApiCall
  };
}

/**
 * Format error message for display
 * @param {Object|string} error - Error object or message
 * @returns {string} - Formatted error message
 */
export function formatErrorMessage(error) {
  if (!error) return '';
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.message) {
    return error.message;
  }
  
  if (error.error) {
    return error.error;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Error boundary component for client components
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Function} props.fallback - Fallback component to render on error
 * @returns {React.ReactNode} - Rendered component
 */
export function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  // Handle error
  const handleComponentError = useCallback((error) => {
    console.error('Error caught by ErrorBoundary:', error);
    setError(error);
    setHasError(true);
  }, []);

  // Reset error state
  const resetError = useCallback(() => {
    setError(null);
    setHasError(false);
  }, []);

  // If there's an error, render fallback
  if (hasError) {
    return fallback({ error, resetError });
  }

  // Otherwise, render children with error handler
  return (
    <div onError={handleComponentError}>
      {children}
    </div>
  );
}

/**
 * Create an API client with error handling
 * @param {Object} options - Client options
 * @param {string} options.baseURL - Base URL for API requests
 * @returns {Object} - API client with error handling
 */
export function createApiClient(options = {}) {
  const { baseURL = '' } = options;
  
  // Create Axios instance
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Add token to headers if available
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle authentication errors
      if (error.response?.status === 401) {
        // Clear token and redirect to login if unauthorized
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  return client;
}

// Create default API client
export const apiClient = createApiClient();
