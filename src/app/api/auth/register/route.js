import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { validateUserData } from '@/utils/validation';

export async function POST(request) {
  try {
    // Connect to database
    console.log('[REGISTER] Attempting to connect to MongoDB...');
    await connectDB();
    console.log('[REGISTER] MongoDB connection attempted.');
    const mongoose = require('mongoose');
    console.log('[REGISTER] Connected to database:', mongoose.connection.name);
    
    // Parse request body
    const rawData = await request.json();
    // Normalise email and username to avoid case-sensitive duplicates
    const userData = {
      ...rawData,
      email: rawData.email?.trim().toLowerCase(),
      username: rawData.username?.trim().toLowerCase()
    };
    console.log('[REGISTER] Registration attempt for:', userData);
    
    // Validate user data
    const validation = validateUserData(userData);
    if (!validation.isValid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }
    
    // Check if user already exists
    // Print all users with the same email before duplicate check
    const usersWithEmail = await User.find({ email: userData.email });
    console.log('[REGISTER] All users with this email:', usersWithEmail);

    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { username: userData.username }
      ]
    });
    console.log('[REGISTER] Existing user lookup result:', existingUser);

    // If we are running against the in-memory mock DB we ignore the two seed accounts
    const isMock = global.__USE_MOCK_DB;
    console.log('[REGISTER] Using mock DB?', isMock);
    if (isMock && global.__MOCK_USERS) {
      console.log('[REGISTER] Current mock users:', global.__MOCK_USERS);
    }
    const isSeedAccount = isMock && existingUser && ['senior_dev', 'junior_dev'].includes(existingUser.username);

    if (existingUser && !isSeedAccount) {
      console.log('[REGISTER] Duplicate user detected, not a seed account.');
      return NextResponse.json({
        error: 'User with this email or username already exists'
      }, { status: 400 });
    }
    
    if (existingUser) {
      console.log('[REGISTER] Duplicate user detected (seed account).');
      return NextResponse.json({ 
        error: 'User with this email or username already exists' 
      }, { status: 400 });
    }
    
    // Create new user – handle potential duplicate key race condition
    let user;
    try {
      user = await User.create({
        username: userData.username,
        email: userData.email,
        password: userData.password, // Will be hashed by the pre-save middleware
        role: userData.role,
        skills: userData.skills || [],
        bio: userData.bio || '',
        profilePicture: userData.profilePicture || ''
      });
    } catch (err) {
      // Handle duplicate key error thrown by MongoDB (code 11000)
      if (err?.code === 11000) {
        return NextResponse.json({
          error: 'User with this email or username already exists'
        }, { status: 400 });
      }
      throw err;
    }
    
    // Return user data (without password)
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
      message: 'User registered successfully',
      user: userResponse
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      error: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed. Please try again.'
    }, { status: 500 });
  }
}
