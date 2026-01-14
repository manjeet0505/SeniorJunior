import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { withAuth } from '@/middleware/authMiddleware';
import Resource from '@/models/Resource';
import ResourceInteraction from '@/models/ResourceInteraction';

async function handler(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const user = request.user;

    const resource = await Resource.findById(id).select('_id viewCount juniorBenefitCount isActive');
    if (!resource || resource.isActive === false) {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }

    const prev = await ResourceInteraction.findOne({ userId: user._id, resourceId: id }).select('viewCount');
    const wasFirstView = !prev || (prev.viewCount || 0) === 0;

    await Promise.all([
      Resource.updateOne(
        { _id: id },
        {
          $inc: {
            viewCount: 1,
            ...(user.role === 'junior' && wasFirstView ? { juniorBenefitCount: 1 } : {}),
          },
        }
      ),
      ResourceInteraction.findOneAndUpdate(
        { userId: user._id, resourceId: id },
        { $inc: { viewCount: 1 }, $set: { lastViewedAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ),
    ]);

    return NextResponse.json({ resourceId: String(id), viewed: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking resource view:', error);
    return NextResponse.json({ error: 'Failed to track view.' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
