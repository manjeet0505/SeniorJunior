/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


async function main() {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.error('Refusing to seed resources in production.');
      process.exit(1);
    }

    console.log('Seeding resources...');

    const mongoose = (await import('mongoose')).default;
    const connectDB = (await import('../lib/db.js')).default;
    const Resource = (await import('../models/Resource.js')).default;
    const ResourceInteraction = (await import('../models/ResourceInteraction.js')).default;

    await connectDB();

    const existingResources = await Resource.countDocuments({});
    const existingInteractions = await ResourceInteraction.countDocuments({});

    const deleteResourcesResult = await Resource.deleteMany({});
    const deleteInteractionsResult = await ResourceInteraction.deleteMany({});

    console.log(`Deleted ${deleteResourcesResult.deletedCount ?? existingResources} old resources`);
    console.log(`Deleted ${deleteInteractionsResult.deletedCount ?? existingInteractions} old resource interactions`);

    const seed = [
      {
        title: 'React Official Documentation',
        url: 'https://react.dev/',
        category: 'Frontend',
        difficulty: 'Beginner',
        type: 'Docs',
        skills: ['React', 'JSX', 'Components', 'Hooks'],
        aiSummary: 'The authoritative React docs. Learn fundamentals, hooks, and best practices with clear examples.',
      },
      {
        title: 'MDN JavaScript Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        category: 'Frontend',
        difficulty: 'Beginner',
        type: 'Docs',
        skills: ['JavaScript', 'Basics', 'ES6'],
        aiSummary: 'A practical JavaScript guide from MDN covering core language concepts with examples and references.',
      },
      {
        title: 'JavaScript.info — Modern JavaScript Tutorial',
        url: 'https://javascript.info/',
        category: 'Frontend',
        difficulty: 'Intermediate',
        type: 'Course',
        skills: ['JavaScript', 'DOM', 'Async', 'Promises'],
        aiSummary: 'A structured, modern JS course covering fundamentals through advanced topics like async and prototypes.',
      },
      {
        title: 'TypeScript Handbook',
        url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
        category: 'Frontend',
        difficulty: 'Intermediate',
        type: 'Docs',
        skills: ['TypeScript', 'Types', 'Generics'],
        aiSummary: 'Official TypeScript handbook. Learn the type system and how to scale JavaScript apps safely.',
      },
      {
        title: 'Tailwind CSS Documentation',
        url: 'https://tailwindcss.com/docs',
        category: 'Frontend',
        difficulty: 'Beginner',
        type: 'Docs',
        skills: ['Tailwind', 'CSS', 'Responsive Design'],
        aiSummary: 'Official Tailwind docs. Quickly learn utility-first CSS patterns for responsive UI development.',
      },
      {
        title: 'Next.js App Router Fundamentals',
        url: 'https://nextjs.org/docs/app',
        category: 'Frontend',
        difficulty: 'Intermediate',
        type: 'Docs',
        skills: ['Next.js', 'App Router', 'Routing', 'Server Components'],
        aiSummary: 'Learn the Next.js App Router model: layouts, routing, data fetching patterns, and server/client boundaries.',
      },
      {
        title: 'Node.js — Official Guides',
        url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
        category: 'Backend',
        difficulty: 'Beginner',
        type: 'Docs',
        skills: ['Node.js', 'Runtime', 'Modules'],
        aiSummary: 'Get started with Node.js fundamentals including modules, async I/O, and building simple servers.',
      },
      {
        title: 'Express.js Guide',
        url: 'https://expressjs.com/en/guide/routing.html',
        category: 'Backend',
        difficulty: 'Beginner',
        type: 'Docs',
        skills: ['Express', 'Routing', 'Middleware'],
        aiSummary: 'Practical Express docs for building APIs: routing, middleware, error handling, and structuring apps.',
      },
      {
        title: 'JWT Authentication — Introduction',
        url: 'https://jwt.io/introduction',
        category: 'Backend',
        difficulty: 'Beginner',
        type: 'Docs',
        skills: ['JWT', 'Auth', 'Security'],
        aiSummary: 'Understand what JWTs are, how they work, and how to use them safely in modern web applications.',
      },
      {
        title: 'MongoDB — Data Modeling Best Practices',
        url: 'https://www.mongodb.com/developer/products/mongodb/mongodb-schema-design-best-practices/',
        category: 'Backend',
        difficulty: 'Intermediate',
        type: 'Docs',
        skills: ['MongoDB', 'Schema Design', 'Indexes'],
        aiSummary: 'Learn how to model data in MongoDB effectively with patterns for embedding, referencing, and indexing.',
      },
      {
        title: 'Mongoose — Models and Queries',
        url: 'https://mongoosejs.com/docs/models.html',
        category: 'Backend',
        difficulty: 'Intermediate',
        type: 'Docs',
        skills: ['Mongoose', 'MongoDB', 'ORM'],
        aiSummary: 'Official Mongoose docs focused on schema modeling, validation, and common query patterns.',
      },
      {
        title: 'HTTP Status Codes — Quick Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
        category: 'Backend',
        difficulty: 'Beginner',
        type: 'Docs',
        skills: ['HTTP', 'APIs', 'Debugging'],
        aiSummary: 'A clear reference for HTTP status codes, useful for designing and debugging REST APIs.',
      },
      {
        title: 'System Design Primer (GitHub)',
        url: 'https://github.com/donnemartin/system-design-primer',
        category: 'Backend',
        difficulty: 'Advanced',
        type: 'Docs',
        skills: ['System Design', 'Scalability', 'Architecture'],
        aiSummary: 'A comprehensive system design collection: scalability concepts, tradeoffs, and interview-style designs.',
      },
      {
        title: 'Grokking the System Design Interview (Overview)',
        url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
        category: 'Backend',
        difficulty: 'Advanced',
        type: 'Course',
        skills: ['System Design', 'Architecture', 'Tradeoffs'],
        aiSummary: 'A guided course on common system design problems and how to communicate tradeoffs clearly.',
      },
      {
        title: 'NeetCode Roadmap (DSA Practice)',
        url: 'https://neetcode.io/roadmap',
        category: 'DSA',
        difficulty: 'Beginner',
        type: 'Practice',
        skills: ['DSA', 'Arrays', 'Hashing', 'Two Pointers'],
        aiSummary: 'A structured DSA roadmap with curated practice problems and patterns for consistent progress.',
      },
      {
        title: 'LeetCode — Top Interview Questions',
        url: 'https://leetcode.com/problem-list/top-interview-questions/',
        category: 'DSA',
        difficulty: 'Intermediate',
        type: 'Practice',
        skills: ['DSA', 'Trees', 'Graphs', 'Dynamic Programming'],
        aiSummary: 'A problem set commonly used in interviews. Great for practicing patterns and speed under constraints.',
      },
      {
        title: 'Big-O Cheat Sheet',
        url: 'https://www.bigocheatsheet.com/',
        category: 'DSA',
        difficulty: 'Beginner',
        type: 'Docs',
        skills: ['Complexity', 'Big-O', 'Data Structures'],
        aiSummary: 'A quick reference for time/space complexity of common algorithms and data structures.',
      },
      {
        title: 'DeepLearning.AI — Machine Learning Specialization',
        url: 'https://www.deeplearning.ai/courses/machine-learning-specialization/',
        category: 'AI',
        difficulty: 'Beginner',
        type: 'Course',
        skills: ['Machine Learning', 'Linear Regression', 'Classification'],
        aiSummary: 'A beginner-friendly ML specialization covering fundamentals with practical intuition and exercises.',
      },
      {
        title: 'OpenAI API Docs — Quickstart',
        url: 'https://platform.openai.com/docs/quickstart',
        category: 'AI',
        difficulty: 'Intermediate',
        type: 'Docs',
        skills: ['OpenAI', 'Prompting', 'APIs'],
        aiSummary: 'Learn how to integrate LLM capabilities into apps: requests, responses, safety, and best practices.',
      },
      {
        title: 'Hugging Face — Transformers Course',
        url: 'https://huggingface.co/learn/nlp-course/chapter1/1',
        category: 'AI',
        difficulty: 'Intermediate',
        type: 'Course',
        skills: ['NLP', 'Transformers', 'Embeddings'],
        aiSummary: 'A hands-on course on Transformers, tokenization, training, and using embeddings for real apps.',
      },
    ];

    const ENUM_MAP = {
      category: {
        frontend: 'Frontend',
        backend: 'Backend',
        dsa: 'DSA',
        ai: 'AI',
      },
      difficulty: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      type: {
        docs: 'Docs',
        course: 'Course',
        practice: 'Practice',
        video: 'Video',
      },
    };

    const normalizedSeed = seed.map((r) => {
      const categoryKey = String(r.category).toLowerCase();
      const difficultyKey = String(r.difficulty).toLowerCase();
      const typeKey = String(r.type).toLowerCase();

      return {
        ...r,
        category: ENUM_MAP.category[categoryKey] ?? r.category,
        difficulty: ENUM_MAP.difficulty[difficultyKey] ?? r.difficulty,
        type: ENUM_MAP.type[typeKey] ?? r.type,
      };
    });

    const insertResult = await Resource.insertMany(normalizedSeed, { ordered: true });

    console.log(`Inserted ${insertResult.length} resources`);
    console.log('Done');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    try {
      const mongoose = (await import('mongoose')).default;
      await mongoose.disconnect();
    } catch {
    }
    process.exit(1);
  }
}

main();
