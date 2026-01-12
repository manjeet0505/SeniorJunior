'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function SearchSeniors() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setIsLoggedIn(true);
    // Load initial data
    fetchSeniors();
  }, [router]);

  const fetchSeniors = async (page = 1, skill = '') => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching seniors with token:', token.substring(0, 10) + '...');
      
      const response = await axios.get(`/api/users/seniors?page=${page}&skill=${skill}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Seniors API response:', response.data);
      
      if (response.data.seniors && response.data.seniors.length > 0) {
        setSeniors(response.data.seniors);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
      } else {
        setSeniors([]);
        console.log('No senior developers found in response');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching senior developers:', err);
      setError(err.response?.data?.error || 'Failed to load senior developers.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSeniors(1, searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchSeniors(page, searchTerm);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-indigo-600">Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Find Senior Developers
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connect with experienced developers who can help you grow your skills
          </p>
        </header>

        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto">
            <div className="flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by skill (e.g., React, JavaScript, Python)"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="ml-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transform transition-all duration-300"
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/50 p-4 mb-8 max-w-4xl mx-auto rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading senior developers...</p>
          </div>
        ) : (
          <>
            {seniors.length === 0 ? (
              <div className="text-center py-12 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 max-w-4xl mx-auto">
                <p className="text-gray-400">No senior developers found. Try a different search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {seniors.map((senior) => (
                  <div key={senior._id} className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-colors duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {senior.username}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Senior Developer
                    </p>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-300 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {senior.skills && senior.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-300 mb-2">Bio</p>
                      <p className="text-sm text-gray-400 line-clamp-3">
                        {senior.bio || 'No bio provided.'}
                      </p>
                    </div>
                    <Link
                      href={`/profile/${senior._id}`}
                      className="w-full block text-center py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transform transition-all duration-300"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-full shadow-lg -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-full border border-white/20 bg-white/10 text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-white/20 bg-white/10 text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 rounded-r-full border border-white/20 bg-white/10 text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
