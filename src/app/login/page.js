'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please log in.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];

      if (formData.email === 'test@example.com' && formData.password === 'password') {
        const mockUser = {
          _id: 'test123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'senior',
          username: 'testuser'
        };
        const mockToken = 'mock-token-for-development';
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        setSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 1500);
        return;
      }

      const response = await axios.post('/api/auth/login', formData, { timeout: 15000 });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setSuccess('Login successful!');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back! Please sign in to continue.">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center">{success}</p>}
        
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-4 w-4 bg-transparent border-gray-600 text-purple-500 focus:ring-purple-500 rounded" />
            Remember Me
          </label>
          <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-purple-400 hover:text-purple-300">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#1A0B2E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
