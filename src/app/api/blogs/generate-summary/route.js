import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { verifyToken } from '@/lib/auth';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Admin-only middleware
async function isAdmin(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return false;
  
  try {
    const decoded = verifyToken(token);
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

function getRoleAdaptedPrompt(userRole, blogTitle, blogContent) {
  const basePrompt = `Summarize this blog post for a ${userRole} developer. Use only bullet points. Be concise and practical. Focus on actionable insights.\n\nTitle: ${blogTitle}\n\nContent: ${blogContent.slice(0, 8000)}`;
  
  if (userRole === 'junior') {
    return `${basePrompt}\n\nAdditional instructions:
- Explain concepts simply
- Highlight learning takeaways
- Emphasize "what to do next"
- Avoid jargon
- Keep it encouraging and clear`;
  }
  
  if (userRole === 'senior') {
    return `${basePrompt}\n\nAdditional instructions:
- Focus on advanced insights
- Include strategic implications
- Mention trade-offs and nuances
- Assume technical depth
- Keep it concise and impactful`;
  }
  
  return basePrompt;
}

export async function POST(request) {
  // Verify admin access
  if (!(await isAdmin(request))) {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  try {
    const { blogId, userRole = 'junior' } = await request.json();

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Skip if summary already exists for this role
    if (blog.aiSummary && blog.aiSummaryMeta?.roleAdapted) {
      return NextResponse.json({
        message: 'Summary already exists',
        summary: blog.aiSummary,
        meta: blog.aiSummaryMeta,
      });
    }

    // Generate AI summary
    const prompt = getRoleAdaptedPrompt(userRole, blog.title, blog.content);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical writer who creates concise, actionable summaries for developers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    
    if (!summary) {
      return NextResponse.json(
        { error: 'Failed to generate summary' },
        { status: 500 }
      );
    }

    // Update blog with AI summary
    await Blog.findByIdAndUpdate(blogId, {
      aiSummary: summary,
      aiSummaryMeta: {
        generatedAt: new Date(),
        model: 'gpt-4-turbo-preview',
        roleAdapted: userRole !== 'junior', // Mark if adapted for senior
        embeddingId: null, // Prepare for future embeddings
        relatedPosts: [], // Prepare for future embeddings
      },
    });

    return NextResponse.json({
      message: 'Summary generated successfully',
      summary,
      meta: {
        generatedAt: new Date(),
        model: 'gpt-4-turbo-preview',
        roleAdapted: userRole !== 'junior',
      },
    });

  } catch (error) {
    console.error('Error generating AI summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
