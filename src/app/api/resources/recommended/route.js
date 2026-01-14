import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { withAuth } from '@/middleware/authMiddleware';
import Resource from '@/models/Resource';
import ResourceInteraction from '@/models/ResourceInteraction';

function normalizeSkill(s) {
  return String(s || '').trim().toLowerCase();
}

function buildExplanation({ role, matchedSkills, categoryMatch }) {
  const parts = [];
  if (role) parts.push(`you are a ${role}`);
  if (categoryMatch) parts.push(`you are exploring ${categoryMatch}`);
  if (matchedSkills?.length) parts.push(`it matches your skills: ${matchedSkills.slice(0, 2).join(', ')}`);
  if (!parts.length) return 'Recommended based on your activity.';
  return `Recommended because ${parts.join(' & ')}.`;
}

async function handler(request) {
  try {
    await connectDB();

    const user = request.user;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') || 8), 20);

    const userSkills = Array.isArray(user.skills) ? user.skills : [];
    const normalizedUserSkills = new Set(userSkills.map(normalizeSkill).filter(Boolean));

    const recent = await ResourceInteraction.find({ userId: user._id, viewCount: { $gt: 0 } })
      .sort({ lastViewedAt: -1 })
      .limit(20)
      .populate('resourceId', 'category')
      .lean();

    const recentCategories = recent
      .map((i) => i.resourceId?.category)
      .filter(Boolean);

    const categoryBias = recentCategories[0] || null;

    const baseQuery = { isActive: true };

    if (user.role === 'junior') {
      baseQuery.difficulty = { $in: ['Beginner', 'Intermediate'] };
    }

    if (user.role === 'senior') {
      baseQuery.difficulty = { $in: ['Intermediate', 'Advanced'] };
    }

    const candidates = await Resource.find(baseQuery)
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean();

    const scored = candidates
      .map((r) => {
        const rSkills = Array.isArray(r.skills) ? r.skills : [];
        const matchedSkills = rSkills.filter((s) => normalizedUserSkills.has(normalizeSkill(s)));

        let score = 0;

        // role fit
        if (user.role === 'junior' && (r.difficulty === 'Beginner' || r.difficulty === 'Intermediate')) score += 3;
        if (user.role === 'senior' && (r.difficulty === 'Advanced' || r.difficulty === 'Intermediate')) score += 3;

        // skill match
        score += Math.min(matchedSkills.length, 3) * 2;

        // activity/category bias
        if (categoryBias && r.category === categoryBias) score += 2;

        // seniors recommending for juniors is a strong signal for juniors
        const recCount = Array.isArray(r.recommendedForJuniorsBy) ? r.recommendedForJuniorsBy.length : 0;
        if (user.role === 'junior') score += Math.min(recCount, 5);

        // popularity
        score += Math.min(Math.floor((r.viewCount || 0) / 50), 3);

        return {
          r,
          score,
          explanation: buildExplanation({
            role: user.role,
            matchedSkills,
            categoryMatch: categoryBias,
          }),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const ids = scored.map((s) => s.r._id);
    const interactions = await ResourceInteraction.find({ userId: user._id, resourceId: { $in: ids } }).lean();
    const interactionById = new Map(interactions.map((i) => [String(i.resourceId), i]));

    const recommendations = scored.map((s) => {
      const r = s.r;
      const inter = interactionById.get(String(r._id));
      const recommendedForJuniorsBy = Array.isArray(r.recommendedForJuniorsBy) ? r.recommendedForJuniorsBy : [];
      const isRecommendedForJuniorsByMe = recommendedForJuniorsBy.some((x) => String(x) === String(user._id));
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
        explanation: s.explanation,
        score: s.score,
      };
    });

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    console.error('Error computing resource recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations.' }, { status: 500 });
  }
}

export const GET = withAuth(handler);
