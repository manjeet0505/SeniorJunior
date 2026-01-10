import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { getMockUsers } from '@/lib/mock-db';

/**
 * Middleware to verify JWT token and attach user to request
 * @param {Function} handler - The route handler function
 * @returns {Function} - The wrapped handler function with authentication
 */
export function withAuth(handler) {
  return async (request, ...args) => {
    console.log('Auth middleware processing request');
    
    try {
      // Get token from cookie or Authorization header
      const cookieStore = await cookies();
      const cookieToken = cookieStore.get('token')?.value;
      
      // Check Authorization header if cookie token not found
      const authHeader = request.headers.get('Authorization');
      let headerToken = null;
      
      if (authHeader) {
        // Handle different formats of Authorization header
        if (authHeader.startsWith('Bearer ')) {
          headerToken = authHeader.substring(7);
        } else if (authHeader.trim()) {
          // If it's not in Bearer format but not empty, use it directly
          headerToken = authHeader.trim();
        }
      }
      
      // Use token from cookie or header
      const token = cookieToken || headerToken;
      
      // Special handling for development mode
      if (process.env.NODE_ENV === 'development' && (!token || token === 'mock-token-for-development')) {
        console.log('Development mode: Using mock user authentication');
        
        // Create a mock user for development
        const mockUser = {
          _id: '507f1f77bcf86cd799439011',
          id: '507f1f77bcf86cd799439011',
          username: 'dev_user',
          email: 'dev@example.com',
          role: 'senior',
          skills: ['JavaScript', 'React', 'Node.js'],
          bio: 'Development mode mock user',
          profilePicture: '/default-avatar.png',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Attach mock user to request
        request.user = mockUser;
        
        // Continue to handler
        return handler(request, ...args);
      }
      
      // Regular token verification for production
      if (!token) {
        console.error('No authentication token found in request');
        return NextResponse.json({ 
          error: 'Authentication required. Please login.' 
        }, { status: 401 });
      }
      
      // Log token format for debugging (only first few characters)
      console.log(`Token found: ${token.substring(0, 10)}...`);
      
      let decoded;
      try {
        // Verify token
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully');
      } catch (tokenError) {
        console.error('Token verification failed:', tokenError.message);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Using mock user despite token error');
          
          // Create a mock user for development
          const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            id: '507f1f77bcf86cd799439011',
            username: 'dev_user',
            email: 'dev@example.com',
            role: 'senior',
            skills: ['JavaScript', 'React', 'Node.js'],
            bio: 'Development mode mock user',
            profilePicture: '/default-avatar.png',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Attach mock user to request
          request.user = mockUser;
          
          // Continue to handler
          return handler(request, ...args);
        }
        
        return NextResponse.json({ 
          error: 'Invalid or expired token. Please login again.' 
        }, { status: 401 });
      }
      
      // Try to connect to database
      let dbConnected = false;
      try {
        await connectDB();
        dbConnected = true;
        console.log('Database connected successfully in auth middleware');
      } catch (dbError) {
        console.error('Database connection error in auth middleware:', dbError);
        // Continue with fallback mechanisms
      }
      
      let user = null;
      
      if (dbConnected) {
        try {
          // Find user by id
          user = await User.findById(decoded.id).select('-password');
          console.log('User found in database:', user ? 'Yes' : 'No');
        } catch (userError) {
          console.error('Error finding user:', userError);
          // Continue with fallback mechanisms
        }
      }
      
      // If database connection failed or user not found, use mock data in development
      if (!user && process.env.NODE_ENV === 'development') {
        console.log('Using mock user data for development');
        user = {
          _id: decoded.id || '507f1f77bcf86cd799439011',
          username: decoded.username || 'dev_user',
          email: decoded.email || 'dev@example.com',
          role: decoded.role || 'senior',
          skills: ['JavaScript', 'React', 'Node.js'],
          bio: 'Development mode mock user',
          profilePicture: '/default-avatar.png'
        };
      } else if (!user) {
        return NextResponse.json({ 
          error: 'User not found. Please login again.' 
        }, { status: 401 });
      }
      
      // Attach user to request
      request.user = user;
      
      // Continue to handler
      return handler(request, ...args);
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ 
          error: 'Invalid token. Please login again.' 
        }, { status: 401 });
      }
      
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ 
          error: 'Token expired. Please login again.' 
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: 'Authentication failed. Please login again.' 
      }, { status: 401 });
    }
  };
}

/**
 * Middleware to restrict access based on user role
 * @param {Function} handler - The route handler function
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} - The wrapped handler function with role-based access control
 */
export function withRole(handler, roles = []) {
  return async (request, ...args) => {
    // First apply authentication middleware
    return withAuth(async (req, ...args) => {
      // Check if user has required role
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return NextResponse.json({ 
          error: 'Access denied. You do not have permission to access this resource.' 
        }, { status: 403 });
      }
      
      // Call the original handler
      return handler(req, ...args);
    })(request, ...args);
  };
}
