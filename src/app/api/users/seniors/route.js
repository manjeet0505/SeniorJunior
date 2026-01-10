import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/middleware/authMiddleware';

async function handler(request) {
  try {
    // Connect to database is handled by the middleware
    // Authentication is handled by the middleware
    
    // Ensure database connection
    await connectDB();
    
    console.log('Seniors API called by user:', request.user?._id);
    
    // Get search parameters
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { role: 'senior' };
    
    // Add skill filter if provided
    if (skill && skill.trim() !== '') {
      query.skills = { $regex: skill, $options: 'i' };
    }
    
    console.log('Searching for seniors with query:', JSON.stringify(query));
    
    // Find senior developers
    const seniors = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    console.log(`Found ${seniors.length} senior developers`);
    
    // Count total matching documents for pagination
    const total = await User.countDocuments(query);
    
    // Create a sample senior if none exist (for testing)
    if (seniors.length === 0 && total === 0) {
      console.log('No seniors found in database, checking if we need to create sample data');
      
      // Check if we need to create sample data
      const totalUsers = await User.countDocuments();
      if (totalUsers < 5) {
        console.log('Creating sample senior developer');
        
        // Create a sample senior developer for testing
        const sampleSenior = new User({
          username: 'seniordeveloper',
          email: 'senior@example.com',
          password: 'password123',
          role: 'senior',
          skills: ['JavaScript', 'React', 'Node.js'],
          bio: 'Experienced senior developer with 10+ years of experience.'
        });
        
        await sampleSenior.save();
        console.log('Created sample senior developer');
      }
    }
    
    return NextResponse.json({
      seniors,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error searching senior developers:', error);
    return NextResponse.json({ error: 'Failed to search senior developers: ' + error.message }, { status: 500 });
  }
}

// Apply authentication middleware
export const GET = withAuth(handler);
