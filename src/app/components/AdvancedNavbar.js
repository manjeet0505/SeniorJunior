"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdvancedNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-none shadow-md flex items-center justify-between px-8 py-4 transition-all duration-300" style={{minHeight: 72}}>
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">SeniorJunior</span>
          </Link>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group">Dashboard</Link>
          <Link href="/resources" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group">Resources</Link>
          <Link href="/schedule" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group">Schedule</Link>
          {isClient && isLoggedIn ? (
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              <div>
                <Link href="/profile/edit" className="text-gray-600 bg-white hover:bg-gray-50 hover:text-indigo-600 px-5 py-2 rounded-full text-sm font-medium border border-gray-200 transition-all duration-200 shadow-sm hover:shadow">Profile</Link>
              </div>
              <div>
                <button onClick={handleSignOut} className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">Sign Out</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              <div>
                <Link href="/login" className="text-gray-600 bg-white hover:bg-gray-50 hover:text-indigo-600 px-5 py-2 rounded-full text-sm font-medium border border-gray-200 transition-all duration-200 shadow-sm hover:shadow">Sign In</Link>
              </div>
              <div>
                <Link href="/register" className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg">Sign Up</Link>
              </div>
            </div>
          )}
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
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
      </nav>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[72px] left-0 w-full md:hidden bg-white shadow-md border-t border-gray-200 z-40">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="/resources" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
            <Link href="/schedule" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Schedule</Link>
            {isClient && isLoggedIn ? (
              <>
                <Link href="/profile/edit" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mt-1">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mt-1" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

