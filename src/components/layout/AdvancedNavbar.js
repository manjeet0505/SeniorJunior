'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useResponsiveNavigation } from '@/utils/responsiveUtils';
import { logout } from '@/utils/authUtils';
import { useRouter } from 'next/navigation';

/**
 * Advanced navigation bar component with responsive design
 * @returns {React.ReactNode} - Rendered navigation component
 */
export default function AdvancedNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMenuOpen, toggleMenu, closeMenu, isMobileOrTablet } = useResponsiveNavigation();
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout(() => {
      router.push('/login');
    });
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const profileHref = user?.id || user?._id ? `/profile/${user?.id || user?._id}` : '/profile/edit';
    const commonItems = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Connections', href: '/connections' },
      { name: 'Messages', href: '/messages' },
      { name: 'Schedule', href: '/schedule' },
      { name: 'Resources', href: '/resources' },
      { name: 'Profile', href: profileHref },
    ];

    // Add role-specific items
    if (user?.role === 'junior') {
      return [
        ...commonItems,
        { name: 'Find Seniors', href: '/seniors' },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="bg-black/20 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-white hover:opacity-80 transition-opacity duration-200">
                SeniorJunior
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden lg:ml-10 lg:flex lg:space-x-8">
              {isClient && !user && [
                { name: 'Your Team', href: '#' },
                { name: 'Solutions', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Pricing', href: '#' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* User dropdown and mobile menu button */}
          <div className="flex items-center">
            {/* Desktop user info and sign out - only when logged in */}
            {isClient && user && (
              <div className="hidden lg:ml-4 lg:flex-shrink-0 lg:flex lg:items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="hidden lg:block mr-3 text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 transform"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop login/register buttons for non-logged in users */}
            {isClient && !user && (
              <div className="hidden lg:flex lg:items-center lg:space-x-6">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-white/20 shadow-lg"
                >
                  Join Now
                </Link>
              </div>
            )}
            
            {/* Mobile menu button - always visible on small screens */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded={isMenuOpen ? "true" : "false"}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - improved visibility */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            {/* Show navigation items for logged in users */}
            {isClient && user ? (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === item.href
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-500 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              /* Show login/register options for non-logged in users */
              <>
                <Link
                  href="/"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === '/'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === '/login'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === '/register'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
