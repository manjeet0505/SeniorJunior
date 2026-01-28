import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
const Blog = require('@/models/Blog');
import Resource from '@/models/Resource';

const CACHE_TTL_MS = 60_000; // 1 minute lightweight cache
const cache = new Map(); // key: slug|limit

function escapeRegex(str = '') {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalize(str) {
  return String(str || '').trim().toLowerCase();
}

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = params || {};
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') || 5), 5);

    if (!slug) {
      return NextResponse.json({ resources: [] }, { status: 400 });
    }

    const cacheKey = `${slug}|${limit}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json({ resources: cached.data }, { status: 200 });
    }

    const blog = await Blog.findOne({ slug, isPublished: true }).select('tags').lean();
    if (!blog) {
      return NextResponse.json({ resources: [] }, { status: 200 });
    }

    const blogTags = Array.isArray(blog.tags) ? blog.tags.map(normalize).filter(Boolean) : [];
    if (!blogTags.length) {
      cache.set(cacheKey, { ts: Date.now(), data: [] });
      return NextResponse.json({ resources: [] }, { status: 200 });
    }

    // Build case-insensitive matchers for skills and category
    const tagRegexes = blogTags.map((t) => new RegExp(`^${escapeRegex(t)}$`, 'i'));

    const query = {
      isActive: true,
      $or: [
        { skills: { $in: tagRegexes } }, // skill overlap (case-insensitive exact)
        { category: { $in: tagRegexes } }, // category overlap (case-insensitive exact)
      ],
    };

    const candidates = await Resource.find(query)
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    // Score by overlap count and difficulty preference (junior-first)
    const scored = candidates
      .map((r) => {
        const rSkills = Array.isArray(r.skills) ? r.skills.map(normalize) : [];
        const rCategory = normalize(r.category);
        const all = new Set([...rSkills, rCategory].filter(Boolean));
        const matchCount = blogTags.reduce((acc, t) => acc + (all.has(t) ? 1 : 0), 0);

        let difficultyBonus = 0; // junior-first preference
        if (r.difficulty === 'Beginner') difficultyBonus = 2;
        else if (r.difficulty === 'Intermediate') difficultyBonus = 1;

        const score = matchCount * 10 + difficultyBonus; // weight matches strongly

        return { r, score, matchCount, difficultyBonus };
      })
      .filter((s) => s.matchCount > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.r);

    const resources = scored.map((r) => ({
      id: String(r._id),
      title: r.title,
      description: r.description,
      url: r.url,
      category: r.category,
      difficulty: r.difficulty,
      type: r.type,
      skills: r.skills || [],
    }));

    cache.set(cacheKey, { ts: Date.now(), data: resources });

    return NextResponse.json({ resources }, { status: 200 });
  } catch (error) {
    console.error('Error fetching related resources:', error);
    return NextResponse.json({ resources: [] }, { status: 500 });
  }
}
