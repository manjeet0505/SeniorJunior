import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
const Blog = require('@/models/Blog');

export async function GET() {
  try {
    await connectDB();
    
    // Debug: Check if Blog model is working
    const allBlogs = await Blog.find({});
    console.log('API: Total blogs in DB:', allBlogs.length);
    
    const blogs = await Blog.find({ isPublished: true })
      .select('title slug excerpt tags readTime featured createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('API: Published blogs found:', blogs.length);
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
