import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
const Blog = require('@/models/Blog');
import OpenAI from 'openai';

// Initialize OpenAI client once per worker
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildPrompt(title, content) {
  const safeContent = String(content || '').slice(0, 8000);
  return `You are a senior mentor writing a concise, practical, decision-focused summary for a long-form technical blog.

Output format:
- 3 to 5 bullet points only
- No intro or conclusion
- No fluff
- Each bullet starts with a strong verb and is under 30 words

Focus on:
- What the reader should understand
- What decisions this blog helps with
- Concrete next actions

Title: ${title}

Content:
${safeContent}`;
}

export async function POST(request, { params }) {
  try {
    await connectDB();

    const { slug } = params || {};
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Load blog by slug
    const blog = await Blog.findOne({ slug, isPublished: true }).select('_id title content aiSummary').lean();
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Idempotency: if already summarized, return early
    if (blog.aiSummary && String(blog.aiSummary).trim().length > 0) {
      return NextResponse.json({ message: 'Summary already exists', summary: blog.aiSummary }, { status: 200 });
    }

    // Build prompt and call OpenAI
    const prompt = buildPrompt(blog.title, blog.content);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical mentor who writes concise, practical, decision-focused summaries using only bullet points.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const summary = completion?.choices?.[0]?.message?.content?.trim();
    if (!summary) {
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }

    // Race-safe write: only set if still missing
    const res = await Blog.updateOne(
      {
        _id: blog._id,
        $or: [
          { aiSummary: { $exists: false } },
          { aiSummary: null },
          { aiSummary: '' },
        ],
      },
      { $set: { aiSummary: summary } }
    );

    // If another writer set it in between, read latest to return a consistent value
    if (res.modifiedCount === 0) {
      const latest = await Blog.findById(blog._id).select('aiSummary').lean();
      return NextResponse.json({ message: 'Summary already exists', summary: latest?.aiSummary || summary }, { status: 200 });
    }

    return NextResponse.json({ message: 'Summary generated successfully', summary }, { status: 200 });
  } catch (error) {
    console.error('Error in generate-summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
