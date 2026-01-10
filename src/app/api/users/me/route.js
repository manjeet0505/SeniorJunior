import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { withAuth } from '@/middleware/authMiddleware';

/**
 * GET /api/users/me
 * Get current authenticated user data
 */
async function handler(request) {
  try {
    await connectDB();
    
    // The user object is attached by the auth middleware
    const user = request.user;
    
    // Return user data without sensitive fields
    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        profilePicture: user.profilePicture
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user data.' 
    }, { status: 500 });
  }
}

// Apply authentication middleware
export const GET = withAuth(handler);
