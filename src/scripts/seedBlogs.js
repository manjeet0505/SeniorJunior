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
    content: `# 5 Signals You're Ready for a Senior Mentor

Most juniors wait too long to get mentorship.

Not because they're lazy.

Because the internet tells you the same story:

- "Just grind DSA."
- "Build 3 projects."
- "Apply to 200 jobs."

Those tactics can work. But they don't tell you **what to do when you’re stuck in the *same* loop**—where you’re moving, but not compounding.

Mentorship is not a magic shortcut. It’s a feedback system.

And the right mentor at the right time can compress months of confusion into a few focused conversations.

Below are **five signals** you’re ready.

---

## Signal 1: You can build things, but your decisions feel random

You’ve built a few projects.

You can ship pages. You can connect APIs. You can deploy.

But if someone asks:

- Why did you choose this database?
- Why did you structure the code this way?
- Why did you use Redux here?

…your honest answer is:

> "I saw it in a tutorial." 

That’s not shameful. That’s normal.

It’s also a strong indicator you’re ready for mentorship—because the next level is **decision quality**, not task completion.

**A senior mentor helps you develop decision frameworks**, not just solutions.

---

## Signal 2: Your bugs are no longer syntax bugs

Early on, bugs are obvious:

- missing semicolons
- wrong imports
- typos

But later, your bugs get harder:

- state becomes inconsistent
- “it works locally but not in production”
- you get race conditions
- your API works… except sometimes

These are *systems* bugs.

And most juniors waste huge time because they debug without a method.

Mentorship helps you learn:

- how seniors narrow scope
- how to form hypotheses
- what logs actually matter
- how to read stack traces and build mental models

If you’re spending hours debugging the same class of issue, you’re ready.

---

## Signal 3: You’re learning a lot but retaining little

You watch tutorials. You take notes. You build clones.

But a week later, you can’t reproduce the architecture.

This happens when learning is **input-heavy** and **feedback-light**.

Senior engineers retain because they:

- connect new ideas to mental models
- get corrected quickly
- learn principles, not steps

Mentorship adds structured feedback.

Instead of "learn React" you learn:

- when to use server vs client components
- what belongs in state vs derived values
- how to reason about performance

The output changes.

---

## Signal 4: Interviews feel like a different universe

Many juniors feel confident while building… then freeze in interviews.

Because interviews test:

- communication
- trade-offs
- reasoning under constraints
- clarity

Not just code.

If you can build but struggle to **explain**, mentorship is the fastest fix.

What a mentor can do in one session:

- run a realistic mock
- show you how to narrate decisions
- teach you how to respond when you don’t know
- give you a plan for DSA + projects that is *balanced*

---

## Signal 5: You feel “busy” but not “directional”

This is the most important one.

If you’re doing a lot—LeetCode, projects, resumes, random topics—yet you can’t answer:

> "What will make me objectively better in 4 weeks?"

…you don’t need more content.

You need a plan.

Mentorship is often less about teaching and more about:

- narrowing priorities
- choosing one skill thread
- cutting low-signal activities
- creating weekly checkpoints

---

# How to make mentorship actually work

If you do book time with a senior mentor, make it count:

## 1) Bring one concrete artifact

Examples:

- a repo you want reviewed
- a PR
- an architecture diagram
- an interview recording
- a list of bugs you keep repeating

Mentors are most useful when they can point at something real.

## 2) Ask for principles, not just fixes

Instead of:

> "How do I fix this?"

Ask:

> "What pattern should I learn so I don’t repeat this?"

## 3) Leave with a 7‑day plan

One week is short enough to execute.

Long enough to measure progress.

---

# Final takeaway

If you recognize yourself in these signals, you’re not behind.

You’re entering the stage where **feedback beats grinding**.

And that’s exactly when a senior mentor becomes leverage.
`,
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
    content: `# DSA vs Projects: What Actually Gets You Hired

If you’re a junior, you’ve probably heard two loud camps:

- **Camp A:** “Grind DSA or you won’t get hired.”
- **Camp B:** “Projects matter more than DSA. Build and ship.”

Both are incomplete.

Hiring decisions are not moral judgments. They are **risk decisions**.

The company is asking:

> “Is this person likely to deliver value in our environment?”

That’s it.

So the real question is not DSA vs Projects.

The real question is:

> “How do I reduce perceived hiring risk?”

---

## What companies actually evaluate (even when they pretend they don’t)

Most interviews test 4 things:

1. **Problem-solving ability** (can you reason through ambiguity?)
2. **Engineering judgment** (can you make good trade-offs?)
3. **Execution** (can you ship a feature without breaking everything?)
4. **Communication** (can others work with you?)

DSA mostly signals #1.

Projects mostly signal #3.

But the best candidates show a bit of everything.

---

## Where DSA matters (and where it doesn’t)

DSA matters when:

- the company uses a LeetCode-style filter
- you are targeting large product companies
- you’re aiming for roles where fundamentals are heavily weighted

DSA matters less when:

- you’re applying to smaller teams that hire on practical skills
- the interview is take-home/project-based
- you’re already strong at explaining architecture and decisions

But here’s the hard truth:

> Even if your dream company values projects, the recruiter may still filter you using DSA.

So you can’t ignore it.

---

## Where projects matter (and why most portfolios fail)

Projects matter when they prove:

- you can ship end-to-end
- you can structure code
- you can work with real constraints

Most portfolios fail because the projects are:

- clones with no opinion
- too small to show architecture
- not presented clearly

If your project looks like:

> “I built a Netflix clone with React”

…and nothing else, it doesn’t reduce risk.

**What reduces risk is decision evidence.**

Add:

- a short README with trade-offs
- screenshots
- a “Why I built it this way” section
- performance considerations
- testing strategy

---

## A senior-style plan (that works for most juniors)

If you want an interview-ready portfolio, use this split:

### 70% Projects

Your goal is to prove execution.

Build 2–3 projects, not 8.

Each project should have:

- authentication
- database interactions
- one non-trivial feature (search, realtime, payments, scheduling)
- deployment
- clean repo structure

### 30% DSA

Your goal is not to become a competitive programmer.

Your goal is to develop a reliable problem-solving workflow:

- clarify requirements
- write examples
- choose data structure
- implement
- test

Focus on:

- arrays/strings
- hash maps
- two pointers
- stacks/queues
- trees basics
- BFS/DFS
- dynamic programming patterns (not all of DP)

---

## What to do if you have 4 weeks

### Week 1

- Pick 1 project that is slightly above your current comfort.
- Do 10–15 DSA problems (easy/medium) focusing on patterns.

### Week 2

- Build core project flows.
- Add one “senior signal”: caching, pagination, rate limiting, CI, testing.
- Keep DSA practice consistent.

### Week 3

- Polish UI/UX.
- Write README and decision notes.
- Do mock interviews.

### Week 4

- Apply.
- Iterate based on feedback.
- Tighten weak DSA areas.

---

# Final takeaway

Projects get you attention.

DSA gets you through filters.

Your job is to build a profile that looks **low-risk** to hire.

Do both—intentionally.
`,
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
    content: `# How to Use AI Without Becoming a Lazy Engineer

AI is the most powerful learning accelerator we’ve had in years.

It’s also the easiest way to stunt your growth.

Both can be true.

If you’re a junior, your goal is not to “finish faster.”

Your goal is to **build reliable engineering judgment**.

This post is a senior-style approach to using AI so you become *sharper*, not dependent.

---

## The problem: AI can give you answers without giving you understanding

When you paste an error into AI and copy the fix, you get:

- a working output
- zero mental model

That feels productive.

But it creates a hidden debt:

> You can’t debug without the tool.

The goal is to turn AI into a *coach*, not a *crutch*.

---

## Principle 1: Think first, ask second

Before you ask AI, do this 90-second routine:

1. **Restate the problem** in your own words.
2. **Write a hypothesis**: what do you think is happening?
3. **List 2 possible causes**.

Then ask AI.

This keeps you in control.

---

## Principle 2: Ask for options + trade-offs, not “the best way”

Bad prompt:

> “How do I implement authentication in Next.js?”

Better prompt:

> “Give me 3 approaches to auth in Next.js App Router for a SaaS product. For each, list trade-offs, security considerations, and when you’d choose it.”

That turns the tool into a decision partner.

---

## Principle 3: Use AI to critique your code (like a senior review)

One of the highest-signal uses:

- paste your code
- ask for a review

Example prompt:

> “Review this API route like a senior engineer. Call out security risks, performance issues, and readability problems. Suggest improvements but don’t rewrite everything.”

You learn faster because you get feedback on:

- structure
- naming
- error handling
- edge cases

---

## Principle 4: Use AI to generate tests and edge cases

Most juniors under-test.

Because they don’t know what to test.

AI is great at listing edge cases:

- null/undefined
- empty arrays
- concurrency
- pagination
- time zones

Prompt:

> “Given this function, list edge cases and write a minimal Jest test suite. Explain why each case matters.”

Then you refine.

---

## Principle 5: Use AI to explain *why*, not just *how*

If AI suggests a fix, follow up:

- “Why does this fix work?”
- “What’s the underlying mechanism?”
- “What would break if I change X?”

This is how you convert answers into understanding.

---

## A simple operating system for juniors

Here’s a weekly workflow that keeps AI helpful:

### Daily

- Use AI for debugging, but always write your hypothesis first.
- Keep a “lessons learned” note.

### Weekly

- Pick 1 concept you struggled with.
- Ask AI for:
  - a mental model
  - 3 examples
  - 3 exercises
  - common mistakes

### Monthly

- Ask AI to review your portfolio repo.
- Identify one recurring weakness.

---

# Final takeaway

AI is not a replacement for thinking.

It’s a multiplier.

Use it to:

- clarify
- critique
- generate edge cases
- accelerate feedback

And always keep the most important skill in your hands:

**the ability to reason.**
`,
    tags: ['AI', 'Career', 'Learning'],
    aiSummary:
      "• Use AI as a co-pilot\n• Think first, ask later\n• Focus on understanding, not copying",
    readTime: "7 min read",
    featured: true,
  },
  {
    title: "Your First System Design as a Junior: A Mentor's Template",
    slug: "first-system-design-mentor-template",
    excerpt:
      "System design isn’t reserved for seniors. Here’s a calm template to think clearly, communicate trade-offs, and design an interview-ready service as a junior.",
    content: `# Your First System Design as a Junior: A Mentor's Template

System design can feel intimidating because people associate it with senior roles.

But here’s the reality:

If you can explain trade-offs and structure, you can do system design.

Not at Netflix-scale.

At *clean* scale.

This article gives you a template that makes you look senior even if you’re new.

---

## Step 1: Clarify the goal (don’t design blindly)

Before diagrams, ask:

- Who uses it?
- What is the core action?
- What does “success” mean?

Example: “Build a mentorship booking system.”

Core action: a junior books a session with a mentor.

Success: booking is saved, confirmed, and visible on dashboards.

---

## Step 2: Define the minimal feature set

As a junior, your biggest mistake is overbuilding.

Start with the core:

- user auth
- browse mentors
- request session
- accept/decline
- schedule time

Then list “v2” features:

- video integration
- payments
- calendar sync
- notifications

This shows judgment.

---

## Step 3: Model data like a product engineer

Write a small schema:

- User (role: junior/senior)
- MentorProfile (skills, availability)
- Session (mentorId, menteeId, time, status)

Think about status transitions:

- requested → accepted → scheduled → completed
- requested → declined

Status flows are where real systems fail.

---

## Step 4: Design APIs around workflows

Instead of random endpoints, design around actions:

- GET /mentors
- POST /sessions (request)
- POST /sessions/:id/accept
- POST /sessions/:id/decline
- GET /sessions?upcoming=true

This reduces frontend complexity.

---

## Step 5: Identify the hard parts early

For mentorship scheduling, the hard parts are:

- double booking
- time zones
- availability windows

A junior who says this looks senior.

Then propose simple mitigations:

- lock availability on booking
- store all times in UTC
- validate conflicts server-side

---

## Step 6: Observability and failure modes

Mention:

- retries on email sending
- idempotency on booking
- logging for acceptance actions

You don’t need to implement all.

You need to show you think about it.

---

# Final takeaway

System design is not about being perfect.

It’s about being structured.

Use this template:

1. clarify goal
2. define minimal feature set
3. model data + status flow
4. APIs around actions
5. call out hard parts
6. failure modes

That’s senior thinking.

---

## A quick example (so you can practice)

Let’s apply the template to something simple: “design a blog platform.”

### Requirements

- users can view a list of posts
- users can read a post by slug
- admins can publish posts

### Data model

- BlogPost: title, slug, excerpt, content, tags, createdAt

### API surface

- GET /api/blogs
- GET /api/blogs/[slug]

### Hard parts

- content length can be large
- you should avoid returning full content in list endpoints
- caching matters if traffic grows

### Failure modes

- slug collisions
- missing posts
- inconsistent published flags

If you can walk through this calmly, you already understand the core of system design.

---

## How to answer system design questions in interviews

When you’re asked to “design X”, interviewers mostly want to see:

- how you clarify requirements
- how you create a minimal viable design
- how you communicate trade-offs

If you freeze, return to the template:

1. goal
2. minimal features
3. data model
4. APIs
5. hard parts
6. failure modes

Even if your final design is imperfect, your process will look senior.
`,
    tags: ['System Design', 'Interview', 'Backend'],
    aiSummary:
      "• Start with a minimal workflow\n• Model status transitions\n• Communicate trade-offs clearly",
    readTime: "8 min read",
    featured: false,
  },
  {
    title: "Code Reviews: The Fastest Skill Upgrade You're Ignoring",
    slug: "code-reviews-fastest-upgrade",
    excerpt:
      "If you want to grow like a senior, stop optimizing for shipping speed and start optimizing for feedback. Code review is the highest ROI habit.",
    content: `# Code Reviews: The Fastest Skill Upgrade You're Ignoring

Most juniors think the fastest way to improve is:

- more tutorials
- more projects
- more LeetCode

Those help.

But the highest ROI habit is often missing:

> Getting your code reviewed.

Why?

Because code review exposes:

- your blind spots
- your habits
- your architecture instincts
- your error handling maturity

In other words: it upgrades your *thinking*.

---

## Why review beats building more

You can build 10 projects and repeat the same mistakes.

You won’t notice because your code “works.”

Reviews force you to confront:

- naming and readability
- duplication
- overengineering
- missing edge cases

This is exactly how seniors get better: fast feedback loops.

---

## What seniors actually look for

When a senior reviews, they care about:

### 1) Clarity

Can someone else understand this in 30 seconds?

### 2) Correctness

What happens if data is missing? Requests fail? Time zones shift?

### 3) Maintainability

Will this code be painful to change next month?

### 4) Security

Are you trusting input? Are you leaking information?

### 5) Performance (only where it matters)

Are you doing unnecessary work? Are you N+1 querying?

---

## How to request a review like a pro

Don’t send:

> “Please review my repo.”

Send:

- Context: what feature you built
- Goal: what you optimized for
- Questions: what you’re unsure about

Example:

> “I built a booking flow. Can you review for error handling and state correctness? I’m not sure if my session status transitions are clean.”

That gets you real feedback.

---

## A simple checklist you can apply yourself

- Are functions small and named clearly?
- Is the happy path readable?
- Are errors handled consistently?
- Are inputs validated?
- Is state derived when possible?
- Are responsibilities separated?

Even before you get a mentor, self-review helps.

---

# Final takeaway

If you want to grow faster, stop trying to do everything alone.

Code review is not criticism.

It’s compound interest for your engineering habits.

---

## How to do self-review when you don’t have a mentor yet

You can simulate review using a checklist.

### Readability

- Are names clear?
- Are functions doing one thing?
- Is the happy path easy to follow?

### Correctness

- What happens when data is missing?
- What happens on network failure?
- Are loading and error states consistent?

### Maintainability

- Is logic duplicated?
- Can you change one feature without touching five files?

### Security basics

- Are you validating inputs?
- Are you exposing sensitive fields?

When you practice this weekly, your code naturally becomes more senior.

---

## How to request review on SeniorJunior (mentor-style)

When you send code for review, include:

1. context: what feature is this
2. goal: what you optimized for
3. questions: what you’re unsure about

Good reviews come from good questions.

That’s how you convert feedback into growth.
`,
    tags: ['Engineering', 'Growth', 'Mentorship'],
    aiSummary:
      "• Review accelerates growth\n• Seniors optimize for clarity and correctness\n• Ask better review questions",
    readTime: "7 min read",
    featured: false,
  },
  {
    title: "Debugging Like a Senior: The Hypothesis-Driven Workflow",
    slug: "debugging-like-a-senior-hypothesis-workflow",
    excerpt:
      "Stop random console.logs. Here’s a senior workflow for debugging complex issues using hypotheses, scope control, and signal-first instrumentation.",
    content: `# Debugging Like a Senior: The Hypothesis-Driven Workflow

Most juniors debug like this:

- change something
- refresh
- hope
- repeat

It feels like progress because the app sometimes starts working.

But it’s not a method. It’s a slot machine.

Senior engineers debug differently.

They don’t have magic intuition.

They have a workflow.

This post gives you that workflow.

---

## The senior mindset: debugging is an investigation

The goal is not to “fix.”

The goal is to discover **the smallest true statement** about the system that narrows the problem.

Examples of high-signal statements:

- “The request is sent, but the response is cached.”
- “The DB write succeeds, but the UI renders stale state.”
- “The code path is never reached due to an early return.”

Once you can say a true statement, the fix becomes obvious.

---

## Step 1: Reproduce reliably (or you’re guessing)

Before you touch code, answer:

- Can I reproduce it in 2 steps?
- Does it happen 100% or 20%?
- What changed recently?

If you can’t reproduce, you need to create a minimal repro:

- smaller dataset
- fewer clicks
- simpler path

No repro = no fix.

---

## Step 2: Define the boundary

When you say “the app is broken,” that’s too big.

Define boundaries:

- Does the API return the expected payload?
- Does the UI receive it?
- Does state store it?
- Does rendering display it?

For Next.js + MongoDB apps, a common boundary breakdown is:

1. request layer
2. server handler
3. database query
4. response shape
5. client state
6. render

Pick the smallest layer you can validate first.

---

## Step 3: Write a hypothesis (one sentence)

Example hypotheses:

- “The API is returning excerpt instead of content.”
- “The UI is rendering content, but CSS is clamping it.”
- “The database contains truncated content due to seeding.”

Pick one.

Then test it.

---

## Step 4: Instrument for signal, not noise

Most juniors add 20 logs.

Seniors add 2 logs that prove or disprove a hypothesis.

Examples:

- log content length at API boundary
- log keys in returned JSON
- log rendered DOM count (rare)

If you’re debugging content issues, log:

- content.length
- typeof content
- the first 200 characters

This tells you instantly: is data short or rendering short?

---

## Step 5: Reduce scope (binary search your system)

If you don’t know where the bug lives, do a binary search:

- If API payload is correct but UI is wrong: bug is client/UI.
- If DB is correct but API is wrong: bug is query/selection.
- If DB is wrong: bug is seed/write path.

Don’t debug the entire system at once.

Debug one boundary at a time.

---

## Step 6: Fix the root, then add a guardrail

Seniors don’t just fix.

They prevent the same class of issue.

Examples of guardrails:

- seed script refuses to run if content is too short
- schema validation (min length)
- tests that assert API returns full content

You don’t need all guardrails.

You need one good one.

---

# Final takeaway

Debugging skill is not “knowing more.”

It’s:

1. reproduce
2. define boundary
3. write hypothesis
4. instrument for signal
5. reduce scope
6. fix root + guardrail

If you practice this workflow, you’ll start feeling like a senior quickly.
`,
    tags: ['Debugging', 'Engineering', 'Growth'],
    aiSummary:
      "• Debug by hypothesis\n• Validate boundaries (DB → API → UI)\n• Add guardrails after fixing root cause",
    readTime: "8 min read",
    featured: false,
  },
  {
    title: "From Tutorial Hell to Interview-Ready: A 30-Day Mentor Plan",
    slug: "tutorial-hell-to-interview-ready-30-day-plan",
    excerpt:
      "A calm, repeatable 30-day plan that turns scattered learning into visible progress: one project, one DSA track, and weekly feedback loops.",
    content: `# From Tutorial Hell to Interview-Ready: A 30-Day Mentor Plan

If you feel busy but not improving, you’re not lazy.

You’re missing structure.

Tutorial hell is not about watching too much.

It’s about **not shipping outcomes you can show**.

This is a 30-day plan I’d give a junior as a mentor.

It’s designed to create:

- one strong project
- one consistent DSA workflow
- one clear story you can tell in interviews

---

## The rules (don’t skip these)

1. You will build **one** project.
2. You will do **small** daily DSA.
3. You will write weekly reflection notes.

The trap is doing too much.

This plan wins by focus.

---

## Pick the right project (the 3-signal test)

Your project must have:

### Signal A: real data

Database + queries + pagination.

### Signal B: real users

Auth + roles (junior/senior/admin).

### Signal C: one non-trivial feature

Examples:

- scheduling
- realtime updates
- search with filters
- file uploads
- notifications

If your project has these three, it will look like product work.

---

## Week 1: Foundations and architecture

Goal: build the spine.

- set up routes
- set up DB models
- implement auth
- create the core pages

Daily DSA:

- 1 easy
- 1 medium

DSA rule: write your explanation in 3 steps:

- approach
- complexity
- edge cases

---

## Week 2: Ship the core workflow end-to-end

Goal: one complete user journey.

Example for mentorship SaaS:

- browse mentors
- request session
- accept/decline
- show it on dashboard

Add correctness signals:

- basic validation
- consistent error responses
- loading states

---

## Week 3: Add a “senior signal”

Pick one and do it well:

- pagination + indexes
- caching
- rate limiting
- test coverage
- audit logs

This is how you stand out.

Most juniors never go beyond “it works.”

---

## Week 4: Polish and interview readiness

Goal: make it easy to evaluate.

- write a README
- add screenshots
- document trade-offs
- add a 2-minute demo script

Do 2 mock interviews:

- one DSA
- one project deep dive

---

## Your interview story template

When asked about your project, don’t just list features.

Use this story:

1. the user problem
2. the core workflow
3. one key trade-off you made
4. one bug you solved and how
5. what you’d improve next

That sounds senior.

---

# Final takeaway

You don’t need more content.

You need one focused month with visible outputs.

Ship one thing.

Learn consistently.

Reflect weekly.

That’s how juniors become interview-ready.

---

## What to track each week (simple metrics)

To stay directional, track:

- number of features shipped
- number of bugs you fixed (and what caused them)
- number of DSA problems you explained clearly
- one lesson you learned (write it down)

If those numbers move, you are improving.

---

## How to avoid the most common failure mode

The most common failure is switching projects mid-month.

Instead of switching, reduce scope:

- remove extra features
- keep only the core workflow
- make it stable

Shipping a smaller finished project beats an ambitious unfinished one.

---

## Final mentor note

You don’t become interview-ready by doing everything.

You become interview-ready by doing a few things consistently and being able to explain them.

That’s the whole game.
`,
    tags: ['Learning', 'Interview', 'Career'],
    aiSummary:
      "• One project, not many\n• Daily small DSA with explanations\n• Weekly reflection creates compounding progress",
    readTime: "9 min read",
    featured: true,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting blog seed...');
    console.log('📡 Connecting to MongoDB...');

    const connectDB = (await import('../lib/db.js')).default;
    const Blog = (await import('../models/Blog.js')).default;

    const MIN_CONTENT_CHARS = 2500;
    const shortBlogs = seedBlogs.filter((b) => (b.content || '').trim().length < MIN_CONTENT_CHARS);
    if (shortBlogs.length > 0) {
      throw new Error(
        `Refusing to seed: ${shortBlogs.length} blog(s) have truncated content (<${MIN_CONTENT_CHARS} chars): ${shortBlogs
          .map((b) => b.slug)
          .join(', ')}`
      );
    }

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
