require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const connectDB = require('../lib/db').default;

// Mock author ID (in real app, get from users collection)
const MOCK_AUTHOR_ID = '507f1f77bcf86cd799439011';

const blogPosts = [
  {
    title: '5 Signals You\'re Ready for a Senior Mentor',
    slug: '5-signals-senior-mentor',
    excerpt: 'Clarity beats speed—know when to seek guidance.',
    content: `# 5 Signals You're Ready for a Senior Mentor

You've been coding for a while. You can build features, fix bugs, and ship code. But something feels missing. You're not sure if you're growing fast enough, or if you're learning the right things.

Here are 5 clear signals that you're ready for a senior mentor:

## 1. You're Stuck on the Same Problems for Weeks

Not just hours—weeks. You've tried different approaches, read documentation, and watched tutorials. But the core issue persists. This isn't about lack of effort; it's about lack of perspective.

A senior mentor has seen this problem dozens of times across different contexts. They can spot the pattern you're missing.

## 2. Your Code Works But You Don't Know Why

You've implemented a solution. It passes tests. It even works in production. But when someone asks "why this approach?" you struggle to explain the trade-offs.

This is a perfect mentorship moment. Understanding the "why" separates juniors from seniors.

## 3. You Want to Understand Trade-offs, Not Just Solutions

You're starting to ask questions like:
- Why choose REST over GraphQL here?
- What are the performance implications of this pattern?
- How does this scale?

These aren't just technical questions—they're strategic thinking questions.

## 4. You're Thinking About System Design and Architecture

You're no longer just implementing features. You're wondering:
- How should these services communicate?
- What happens when this fails?
- How do we make this maintainable?

That's senior-level thinking. But you need guidance to avoid common pitfalls.

## 5. You're Ready to Learn from Others' Mistakes

You recognize that you don't have enough experience to know all the failure modes. You want to learn from someone who's already made these mistakes.

This is perhaps the most important signal: humility combined with ambition.

---

If 3+ of these resonate, it's time. A senior mentor won't just give you answers—they'll give you frameworks, mental models, and confidence to make better decisions.

Ready to accelerate your growth?`,
    tags: ['mentorship', 'career', 'juniors'],
    readTime: '6 min read',
    featured: false,
    author: MOCK_AUTHOR_ID,
  },
  {
    title: 'Mentoring Without Burnout: A Senior\'s Playbook',
    slug: 'mentoring-without-burnout',
    excerpt: 'Leverage your time with structure and AI continuity.',
    content: `# Mentoring Without Burnout: A Senior's Playbook

You love helping juniors grow. But you're also building production features, leading projects, and trying to maintain your own skills. Mentoring can't come at the cost of your career growth.

Here's how to mentor effectively without burning out:

## 1. Set Clear Boundaries and Session Limits

Don't let mentorship become an endless support contract:
- 30-minute sessions max
- 2 sessions per week per junior
- Clear response time expectations
- Emergency exceptions only for production issues

## 2. Use Templates for Common Junior Questions

You'll answer the same questions repeatedly. Create templates:

**Technical Questions:**
- "Here's how I think about this problem..."
- "Let me share a framework for..."

**Career Questions:**
- "Based on what I've seen..."
- "Here are three paths to consider..."

Templates save 80% of your time while maintaining personalization.

## 3. Leverage AI for Preliminary Code Reviews

Before you spend 30 minutes reviewing code:
- Ask AI to do a first pass
- Focus your time on architectural decisions
- Look for patterns, not just syntax

AI handles the obvious; you handle the valuable insights.

## 4. Focus on Principles, Not Just Fixes

Don't just fix their code—teach them how to think:
- "This pattern suggests..."
- "Consider the edge cases of..."
- "Here's how to test this approach..."

Principles scale. Fixes don't.

## 5. Build a Knowledge Base to Scale Your Impact

Document your insights:
- Common junior mistakes
- Decision frameworks
- Architectural patterns

Share this with your team. Now you're not just mentoring one person—you're improving engineering culture.

---

Great mentoring isn't about how much time you give. It's about how much impact you create per hour.

These strategies help you mentor 2-3x more effectively while growing your own career.`,
    tags: ['mentorship', 'seniors', 'productivity'],
    readTime: '8 min read',
    featured: true,
    author: MOCK_AUTHOR_ID,
  },
  {
    title: 'AI as a Mentorship Co-Pilot, Not Replacement',
    slug: 'ai-mentorship-copilot',
    excerpt: 'Use AI to summarize, recommend, and track—humans guide.',
    content: `# AI as a Mentorship Co-Pilot, Not Replacement

AI is changing mentorship. But it's not replacing human mentors—it's amplifying them.

## What AI Does Well

**Summarization:**
- Transcribe mentorship sessions automatically
- Extract key decisions and action items
- Create searchable knowledge base

**Recommendation:**
- Suggest relevant resources based on discussion topics
- Identify knowledge gaps in conversations
- Recommend next learning steps

**Tracking:**
- Monitor progress on action items
- Flag when patterns emerge across sessions
- Measure skill development over time

## What Humans Do Best

**Context:**
- Understand career goals and personal situations
- Recognize when someone is overwhelmed vs. curious
- Adapt communication style to individual needs

**Wisdom:**
- Share experiences from real projects and failures
- Navigate organizational politics and team dynamics
- Make judgment calls when data is incomplete

**Empathy:**
- Recognize burnout and imposter syndrome
- Celebrate wins and provide encouragement
- Build trust through vulnerability

## The Co-Pilot Model

Think of AI as your co-pilot, not as pilot:

1. **AI handles: data**: Transcribes, summarizes, tracks
2. **Human handles: wisdom**: Interprets, guides, inspires
3. **Together they create compound value**: AI + Human > AI alone

## Practical Implementation

**For Mentors:**
- Use AI to prepare session summaries
- Let AI surface patterns across multiple mentees
- Focus your time on high-impact conversations

**For Mentees:**
- Use AI to review and reinforce learning
- Ask AI to clarify technical concepts between sessions
- Build your personal knowledge base with AI assistance

---

The future of mentorship isn't AI OR humans. It's AI AND humans, each playing to their strengths.

Are you ready to leverage both?`,
    tags: ['ai', 'mentorship', 'productivity'],
    readTime: '7 min read',
    featured: false,
    author: MOCK_AUTHOR_ID,
  },
  {
    title: 'From Junior to Confident: A 90-Day Roadmap',
    slug: 'junior-to-confident-90-day',
    excerpt: 'Weekly milestones that turn ambiguity into momentum.',
    content: `# From Junior to Confident: A 90-Day Roadmap

The first 90 days at a new company or team define your trajectory. Here's how to go from junior to confident contributor.

## Weeks 1-2: Master Your Stack Fundamentals

**Technical Goals:**
- Set up local development environment
- Understand deployment pipeline
- Master the codebase navigation
- Learn team's coding standards

**Confidence Goals:**
- Ship your first bug fix
- Ask clarifying questions in PR reviews
- Document what you learned

## Weeks 3-4: Contribute to Production Features

**Technical Goals:**
- Complete a small feature end-to-end
- Write tests for your code
- Participate in code reviews
- Debug production issues

**Confidence Goals:**
- Your code ships without constant oversight
- You can explain your design decisions
- You start suggesting improvements

## Weeks 5-6: Lead a Small Project End-to-End

**Technical Goals:**
- Own a feature from conception to deployment
- Coordinate with other team members
- Present your work in team meetings
- Handle production issues for your feature

**Confidence Goals:**
- You're the go-to person for your feature
- You can mentor new team members on it
- You make architectural suggestions

## Weeks 7-8: Mentor Another Junior

**Technical Goals:**
- Review someone else's code thoughtfully
- Help debug complex issues
- Share your learning process
- Document best practices

**Confidence Goals:**
- You can explain concepts clearly
- Your feedback is constructive and actionable
- You're seen as a reliable team member

## Weeks 9-10: Present Your Work to Team

**Technical Goals:**
- Present your project's architecture
- Share lessons learned and challenges overcome
- Propose improvements to team processes
- Contribute to technical documentation

**Confidence Goals:**
- You can handle Q&A confidently
- You articulate trade-offs clearly
- You're ready for more responsibility

## Key Mindsets

**Embrace Feedback:**
- Every critique is a growth opportunity
- Ask "what could I do better?" not "why is this wrong?"
- Track your improvements over time

**Document Everything:**
- Your future self will thank you
- Create decision logs for complex choices
- Share your knowledge with the team

**Stay Curious:**
- Ask "why" about architectural decisions
- Learn adjacent technologies
- Understand the business impact of your work

---

Confidence isn't about knowing everything. It's about trusting your problem-solving process and learning quickly.

Follow this roadmap and you'll transform from junior to confident contributor in 90 days.`,
    tags: ['career', 'growth', 'roadmap'],
    readTime: '10 min read',
    featured: false,
    author: MOCK_AUTHOR_ID,
  },
];

async function seedBlogs() {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ ERROR: Cannot run seed script in production');
    process.exit(1);
  }

  try {
    console.log('🌱 Starting blog seed...');
    
    await connectDB();
    
    // Clear existing blogs (idempotent)
    await Blog.deleteMany({});
    console.log('🗑️ Cleared existing blogs');
    
    // Insert new blogs
    const insertedBlogs = await Blog.insertMany(blogPosts);
    console.log(`✅ Inserted ${insertedBlogs.length} blog posts`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    
    console.log('✨ Blog seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedBlogs();
}

module.exports = seedBlogs;
