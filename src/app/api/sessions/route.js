import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import { getUserIdFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);

    if (!userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query for user's sessions (as mentor or mentee)
    const query = {
      $or: [
        { mentorId: userId },
        { menteeId: userId }
      ]
    };

    // If upcoming sessions requested, filter for future sessions
    if (upcoming) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.sessionDate = { $gte: today };
    }

    const sessions = await Session.find(query)
      .populate('mentorId', 'username email')
      .populate('menteeId', 'username email')
      .sort({ sessionDate: 1, sessionTime: 1 })
      .limit(limit);

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

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
