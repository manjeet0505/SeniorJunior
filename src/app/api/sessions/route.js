import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import { getUserIdFromToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { mentorId, sessionDate, sessionTime, notes } = await request.json();
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const menteeId = getUserIdFromToken(token);

    if (!menteeId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const newSession = new Session({
      mentorId,
      menteeId,
      sessionDate,
      sessionTime,
      notes,
    });

    await newSession.save();

    return NextResponse.json({ message: 'Session booked successfully', session: newSession }, { status: 201 });
  } catch (error) {
    console.error('Error booking session:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
