"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdvancedNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileHref = user?.id || user?._id ? `/profile/${user?.id || user?._id}` : "/profile/edit";

  useEffect(() => {
    setIsClient(true);
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  const navClass = scrolled
    ? "bg-black/30 backdrop-blur-lg border-b border-white/10"
    : "bg-transparent";

  const linkClass = scrolled ? "text-gray-300 hover:text-white" : "text-gray-300 hover:text-white";

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 ${navClass}`} style={{minHeight: 72}}>
        <div className="flex-shrink-0">
          <Link href="/">
            <span className="text-2xl font-bold text-white">SeniorJunior</span>
          </Link>
        </div>
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link href="/dashboard" className={`${linkClass} px-3 py-2 rounded-md text-sm font-medium`}>Dashboard</Link>
          <Link href="/resources" className={`${linkClass} px-3 py-2 rounded-md text-sm font-medium`}>Resources</Link>
          <Link href="/schedule" className={`${linkClass} px-3 py-2 rounded-md text-sm font-medium`}>Schedule</Link>
          {isClient && isLoggedIn ? (
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
              <Link href={profileHref} className="text-gray-300 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full text-sm font-medium border border-transparent transition-all duration-200">Profile</Link>
              <button onClick={handleSignOut} className="text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200">Sign Out</button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
              <Link href="/login" className="text-gray-300 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full text-sm font-medium border border-transparent transition-all duration-200">Sign In</Link>
              <Link href="/register" className="text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200">Sign Up</Link>
            </div>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed top-[72px] left-0 w-full md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 z-40">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="/resources" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
            <Link href="/schedule" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Schedule</Link>
            {isClient && isLoggedIn ? (
              <>
                <Link href={profileHref} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <button onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 mt-1">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 mt-1" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

