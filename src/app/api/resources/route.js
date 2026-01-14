import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { withAuth } from '@/middleware/authMiddleware';
import Resource from '@/models/Resource';
import ResourceInteraction from '@/models/ResourceInteraction';

function parseListParam(value) {
  if (!value) return null;
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function handler(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const type = searchParams.get('type');
    const categories = parseListParam(searchParams.get('categories'));
    const difficulties = parseListParam(searchParams.get('difficulties'));
    const types = parseListParam(searchParams.get('types'));

    const savedOnly = searchParams.get('savedOnly') === 'true';

    const limit = Math.min(Number(searchParams.get('limit') || 24), 100);
    const page = Math.max(Number(searchParams.get('page') || 1), 1);
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (q) {
      query.$text = { $search: q };
    }

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;

    if (categories?.length) query.category = { $in: categories };
    if (difficulties?.length) query.difficulty = { $in: difficulties };
    if (types?.length) query.type = { $in: types };

    let savedResourceIds = null;
    if (savedOnly) {
      const interactions = await ResourceInteraction.find({ userId: request.user._id, saved: true }).select('resourceId');
      savedResourceIds = interactions.map((i) => i.resourceId);
      query._id = { $in: savedResourceIds.length ? savedResourceIds : [] };
    }

    const sort = q ? { score: { $meta: 'textScore' } } : { updatedAt: -1 };

    const [items, total] = await Promise.all([
      Resource.find(query, q ? { score: { $meta: 'textScore' } } : undefined)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Resource.countDocuments(query),
    ]);

    const resourceIds = items.map((r) => r._id);
    const interactions = await ResourceInteraction.find({
      userId: request.user._id,
      resourceId: { $in: resourceIds },
    }).lean();

    const interactionById = new Map(interactions.map((i) => [String(i.resourceId), i]));

    const resources = items.map((r) => {
      const inter = interactionById.get(String(r._id));
      const recommendedForJuniorsBy = Array.isArray(r.recommendedForJuniorsBy) ? r.recommendedForJuniorsBy : [];
      const isRecommendedForJuniorsByMe = recommendedForJuniorsBy.some((x) => String(x) === String(request.user._id));
      return {
        id: String(r._id),
        title: r.title,
        description: r.description,
        url: r.url,
        category: r.category,
        difficulty: r.difficulty,
        type: r.type,
        skills: r.skills || [],
        aiSummary: r.aiSummary || '',
        viewCount: r.viewCount || 0,
        juniorBenefitCount: r.juniorBenefitCount || 0,
        recommendedForJuniorsCount: recommendedForJuniorsBy.length,
        isRecommendedForJuniorsByMe,
        isSaved: Boolean(inter?.saved),
        userViewCount: inter?.viewCount || 0,
        lastViewedAt: inter?.lastViewedAt || null,
      };
    });

    return NextResponse.json(
      {
        resources,
        pagination: { page, limit, total, hasMore: skip + resources.length < total },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error listing resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources.' }, { status: 500 });
  }
}

export const GET = withAuth(handler);
