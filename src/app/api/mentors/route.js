import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectDB();

    const mentors = await User.find({ role: 'senior' }).select('username skills');

    if (!mentors) {
      return NextResponse.json({ message: 'No mentors found' }, { status: 404 });
    }

    return NextResponse.json(mentors, { status: 200 });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
