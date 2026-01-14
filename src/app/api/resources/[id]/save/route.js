import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { withAuth } from '@/middleware/authMiddleware';
import ResourceInteraction from '@/models/ResourceInteraction';
import Resource from '@/models/Resource';

async function handler(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const userId = request.user._id;

    // Ensure resource exists
    const resource = await Resource.findById(id).select('_id isActive');
    if (!resource || resource.isActive === false) {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const desired = typeof body?.saved === 'boolean' ? body.saved : null;

    const interaction = await ResourceInteraction.findOne({ userId, resourceId: id });

    const nextSaved = desired ?? !Boolean(interaction?.saved);

    const next = await ResourceInteraction.findOneAndUpdate(
      { userId, resourceId: id },
      { $set: { saved: nextSaved } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json(
      {
        resourceId: String(id),
        saved: Boolean(next.saved),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving resource:', error);
    return NextResponse.json({ error: 'Failed to update saved state.' }, { status: 500 });
  }
}

export const POST = withAuth(handler);
