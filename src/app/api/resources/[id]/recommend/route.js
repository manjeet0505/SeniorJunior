import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { withAuth } from '@/middleware/authMiddleware';
import Resource from '@/models/Resource';

async function handler(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const user = request.user;

    if (user.role !== 'senior') {
      return NextResponse.json({ error: 'Only seniors can recommend resources.' }, { status: 403 });
    }

    const resource = await Resource.findById(id).select('_id recommendedForJuniorsBy isActive');
    if (!resource || resource.isActive === false) {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }

    const already = (resource.recommendedForJuniorsBy || []).some((x) => String(x) === String(user._id));

    const next = await Resource.findByIdAndUpdate(
      id,
      already
        ? { $pull: { recommendedForJuniorsBy: user._id } }
        : { $addToSet: { recommendedForJuniorsBy: user._id } },
      { new: true }
    ).select('_id recommendedForJuniorsBy');

    return NextResponse.json(
      {
        resourceId: String(id),
        recommended: !already,
        recommendedForJuniorsCount: Array.isArray(next?.recommendedForJuniorsBy) ? next.recommendedForJuniorsBy.length : 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recommending resource:', error);
    return NextResponse.json({ error: 'Failed to update recommendation.' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
