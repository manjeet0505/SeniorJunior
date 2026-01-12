'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleSessionPage = () => {
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({
    mentorId: '',
    sessionDate: '',
    sessionTime: '',
    notes: '',
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('/api/mentors');
        setMentors(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, mentorId: response.data[0]._id }));
        }
      } catch (error) {
        console.error('Failed to fetch mentors', error);
        setStatus(prev => ({ ...prev, error: 'Failed to load mentors.' }));
      }
    };
    fetchMentors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mentorId || !formData.sessionDate || !formData.sessionTime) {
      setStatus({ loading: false, error: 'Please fill in all required fields.', success: null });
      return;
    }
    setStatus({ loading: true, error: null, success: null });
    try {
      const response = await axios.post('/api/sessions', formData);
      setStatus({ loading: false, error: null, success: 'Session booked successfully!' });
      setFormData({ mentorId: mentors[0]?._id || '', sessionDate: '', sessionTime: '', notes: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to book session.';
      setStatus({ loading: false, error: errorMessage, success: null });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0B2E] text-white pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Schedule a Session</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Book a one-on-one session with your chosen mentor.</p>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white mb-2">Booking Details</h2>
            <p className="text-gray-400 mb-8">Select a mentor and your preferred time to connect.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="mentorId" className="block text-gray-300 font-semibold mb-2">Select Mentor</label>
                <select id="mentorId" name="mentorId" value={formData.mentorId} onChange={handleChange} className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 transition text-white">
                  {mentors.length > 0 ? (
                    mentors.map(mentor => (
                      <option key={mentor._id} value={mentor._id} className="bg-gray-800">
                        {mentor.username} ({mentor.skills.join(', ')})
                      </option>
                    ))
                  ) : (
                    <option disabled className="bg-gray-800">Loading mentors...</option>
                  )}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sessionDate" className="block text-gray-300 font-semibold mb-2">Select Date</label>
                  <input 
                    type="date" 
                    id="sessionDate"
                    name="sessionDate"
                    value={formData.sessionDate}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 transition text-white"
                  />
                </div>
                <div>
                  <label htmlFor="sessionTime" className="block text-gray-300 font-semibold mb-2">Select Time Slot</label>
                  <select id="sessionTime" name="sessionTime" value={formData.sessionTime} onChange={handleChange} className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 transition text-white">
                    <option value="" className="bg-gray-800">Select a time</option>
                    <option value="10:00 AM - 11:00 AM" className="bg-gray-800">10:00 AM - 11:00 AM</option>
                    <option value="2:00 PM - 3:00 PM" className="bg-gray-800">2:00 PM - 3:00 PM</option>
                    <option value="5:00 PM - 6:00 PM" className="bg-gray-800">5:00 PM - 6:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-gray-300 font-semibold mb-2">Notes for Mentor (Optional)</label>
                <textarea 
                  id="notes"
                  name="notes"
                  rows="4" 
                  placeholder="What would you like to discuss?"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 transition text-white placeholder-gray-400"
                ></textarea>
              </div>
              {status.error && <p className="text-red-400 text-center font-semibold">{status.error}</p>}
              {status.success && <p className="text-green-400 text-center font-semibold">{status.success}</p>}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={status.loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full py-3.5 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status.loading ? 'Booking...' : 'Confirm & Book Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSessionPage;
