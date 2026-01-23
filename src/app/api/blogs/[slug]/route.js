import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
const Blog = require('@/models/Blog');

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }
    
    const blog = await Blog.findOne({ slug, isPublished: true })
      .select('title slug content excerpt tags readTime featured createdAt viewCount likeCount aiSummary')
      .lean();
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
    
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}
