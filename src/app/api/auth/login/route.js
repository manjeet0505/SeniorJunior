import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { getMockUsers } from '@/lib/mock-db';

export async function POST(request) {
  try {
    console.log('Login attempt received');
    
    // Parse request body first to get credentials
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Please provide email and password' 
      }, { status: 400 });
    }
    
    console.log(`Login attempt for email: ${email}`);
    
    // Try to connect to database with proper error handling
    let dbConnected = false;
    try {
      await connectDB();
      dbConnected = true;
      console.log('Database connected successfully for login');
    } catch (dbError) {
      console.error('Database connection error during login:', dbError);
      // Continue with fallback mechanisms
    }
    
    // Find user by email
    let user = null;
    
    // Try to find user in database if connection was successful
    if (dbConnected) {
      try {
        user = await User.findOne({ email }).select('+password');
        console.log('User lookup result:', user ? 'Found' : 'Not found');
      } catch (findError) {
        console.error('Error finding user in database:', findError);
      }
    }
    
    // If in development environment and database connection failed, check mock users
    if (!user && (process.env.NODE_ENV === 'development' || !dbConnected)) {
      console.log('Checking mock users for login');
      const mockUsers = getMockUsers();
      const mockUser = mockUsers.find(u => u.email === email);
      
      if (mockUser && mockUser.password === password) {
        // For mock users, we'll create a simplified user object
        user = {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          username: mockUser.username,
          comparePassword: async (pwd) => pwd === mockUser.password
        };
        console.log('Using mock user for login:', mockUser.email);
      }
    }
    
    // Check if user exists
    if (!user) {
      console.log('Login failed: Invalid credentials (user not found)');
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return NextResponse.json({ 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Set token in HTTP-only cookie (more secure than localStorage)
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'strict'
    });
    
    // Return user data and token
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      skills: user.skills,
      bio: user.bio,
      profilePicture: user.profilePicture
    };
    
    return NextResponse.json({ 
      message: 'Login successful',
      user: userResponse,
      token // Also return token for client-side storage if needed
    }, { status: 200 });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Login failed. Please try again.' 
    }, { status: 500 });
  }
}
