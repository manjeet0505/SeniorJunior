'use client';

import { useState, useEffect } from 'react';
import { formatErrorMessage } from '@/utils/errorUtils';

/**
 * Error display component for consistent error messaging
 * @param {Object} props - Component props
 * @param {Object|string} props.error - Error object or message
 * @param {boolean} props.dismissible - Whether the error can be dismissed
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onDismiss - Callback when error is dismissed
 * @returns {React.ReactNode} - Rendered component
 */
export default function ErrorDisplay({ 
  error, 
  dismissible = true, 
  className = '',
  onDismiss = () => {} 
}) {
  const [visible, setVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage(formatErrorMessage(error));
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [error]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  if (!visible || !errorMessage) {
    return null;
  }

  return (
    <div className={`bg-red-50 border-l-4 border-red-400 p-4 mb-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Success message component for consistent success messaging
 * @param {Object} props - Component props
 * @param {string} props.message - Success message
 * @param {boolean} props.dismissible - Whether the message can be dismissed
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onDismiss - Callback when message is dismissed
 * @returns {React.ReactNode} - Rendered component
 */
export function SuccessDisplay({ 
  message, 
  dismissible = true, 
  className = '',
  onDismiss = () => {} 
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  if (!visible || !message) {
    return null;
  }

  return (
    <div className={`bg-green-50 border-l-4 border-green-400 p-4 mb-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-green-700">{message}</p>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Loading indicator component
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether loading is in progress
 * @param {string} props.message - Loading message
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactNode} - Rendered component
 */
export function LoadingIndicator({ 
  isLoading = true, 
  message = 'Loading...', 
  className = '' 
}) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
      <p className="text-sm text-gray-700">{message}</p>
    </div>
  );
}
