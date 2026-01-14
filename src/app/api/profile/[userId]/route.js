import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Connection from '@/models/Connection';
import Session from '@/models/Session';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { userId } = await params;

    const token = getTokenFromRequest(request);
    let viewer = null;

    if (token) {
      try {
        const decoded = verifyToken(token);
        viewer = { id: decoded.id, role: decoded.role };
      } catch (e) {
        viewer = null;
      }
    }

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profileUserId = user._id;

    const [connectionsCount, sessionsCount, mentorshipSessionsCount, learningSessionsCount] = await Promise.all([
      Connection.countDocuments({
        $or: [
          { requesterId: profileUserId, status: 'accepted' },
          { recipientId: profileUserId, status: 'accepted' }
        ]
      }),
      Session.countDocuments({
        $or: [{ mentorId: profileUserId }, { menteeId: profileUserId }]
      }),
      Session.countDocuments({ mentorId: profileUserId }),
      Session.countDocuments({ menteeId: profileUserId })
    ]);

    let connectionStatus = null;
    let isOwnProfile = false;

    if (viewer?.id) {
      isOwnProfile = String(viewer.id) === String(profileUserId);

      if (!isOwnProfile) {
        const connection = await Connection.findOne({
          $or: [
            { requesterId: viewer.id, recipientId: profileUserId },
            { requesterId: profileUserId, recipientId: viewer.id }
          ]
        }).lean();

        connectionStatus = connection?.status ?? null;
      }
    }

    const stats = {
      connections: connectionsCount,
      sessions: sessionsCount,
      mentorshipSessions: mentorshipSessionsCount,
      learningSessions: learningSessionsCount,
      rating: null,
      menteesHelped: null
    };

    return NextResponse.json(
      {
        profile: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profilePicture: user.profilePicture,
            skills: user.skills || [],
            learningSkills: user.learningSkills || [],
            experienceLevel: user.experienceLevel || '',
            yearsOfExperience: user.yearsOfExperience || 0,
            lookingForMentorshipIn: user.lookingForMentorshipIn || [],
            availability: user.availability ?? null,
            status: user.status || 'offline',
            social: user.social || { github: '', linkedin: '', website: '' }
          },
          stats,
          viewer: {
            isOwnProfile,
            connectionStatus
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error building profile view:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
