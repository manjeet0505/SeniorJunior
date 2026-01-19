import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

// DEV-only safety check
if (process.env.NODE_ENV === 'production') {
  console.error('❌ ERROR: This script cannot run in production');
  process.exit(1);
}

// Mock author ID
const MOCK_AUTHOR_ID = new mongoose.Types.ObjectId();

const seedBlogs = [
  {
    title: "5 Signals You're Ready for a Senior Mentor",
    slug: "5-signals-senior-mentor",
    excerpt:
      "Most juniors waste months stuck on the same problems. Here's exactly when to seek guidance and how to make it count.",
    content: `Most juniors spend months learning the wrong things.

You're stuck on the same problems, your code works but you don't know why — these are not weaknesses.
These are signals you're ready for mentorship.`,
    tags: ['Mentorship', 'Career', 'Growth'],
    aiSummary:
      "• You're stuck on patterns, not just problems\n• You want feedback on thinking, not syntax\n• You're ready to learn from experience",
    readTime: "6 min read",
    featured: true,
  },
  {
    title: "DSA vs Projects: What Actually Gets You Hired",
    slug: "dsa-vs-projects-what-gets-hired",
    excerpt:
      "Stop the endless debate. Here's the brutal truth about what companies actually look for.",
    content: `DSA vs Projects is the wrong question.

Companies hire engineers who can think, explain, and build.
Here’s how both really matter.`,
    tags: ['DSA', 'Career', 'Interview'],
    aiSummary:
      "• Companies hire problem-solvers\n• Use 70% projects, 30% DSA\n• Show thinking, not grinding",
    readTime: "5 min read",
    featured: false,
  },
  {
    title: "How to Use AI Without Becoming a Lazy Engineer",
    slug: "use-ai-without-becoming-lazy",
    excerpt:
      "AI should make you sharper, not dependent. Here's how seniors use it.",
    content: `AI is a tool, not a brain replacement.

Use it to review thinking, not skip it.`,
    tags: ['AI', 'Career', 'Learning'],
    aiSummary:
      "• Use AI as a co-pilot\n• Think first, ask later\n• Focus on understanding, not copying",
    readTime: "7 min read",
    featured: true,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting blog seed...');
    console.log('📡 Connecting to MongoDB...');

    const connectDB = (await import('../lib/db.js')).default;
    const Blog = (await import('../models/Blog.js')).default;

    await connectDB();
    console.log('✅ MongoDB connected');

    console.log('🗑️ Clearing existing blogs...');
    await Blog.deleteMany({});

    console.log('📝 Inserting seed blogs...');
    const inserted = await Blog.insertMany(
      seedBlogs.map((b) => ({
        ...b,
        author: MOCK_AUTHOR_ID,
        isPublished: true,
      }))
    );

    console.log(`✅ Inserted ${inserted.length} blogs`);
    inserted.forEach((b, i) =>
      console.log(`${i + 1}. ${b.title} (${b.slug})`)
    );

    await mongoose.disconnect();
    console.log('🔒 DB connection closed');
    console.log('✨ Blog seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Blog seeding failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
