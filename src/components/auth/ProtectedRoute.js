'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/authUtils';
import { LoadingIndicator } from '@/components/ui/ErrorDisplay';

/**
 * Protected route component to restrict access to authenticated users
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} props.allowedRoles - Array of roles allowed to access the route
 * @returns {React.ReactNode} - Rendered component
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { user, loading, error, authenticated } = useAuth({ allowedRoles });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading indicator while checking authentication
  if (loading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator message="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authenticated) {
    if (isClient) {
      router.push('/login');
    }
    return null;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 max-w-md w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Access denied. You do not have permission to access this page.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Render children if authenticated and authorized
  return children;
}
