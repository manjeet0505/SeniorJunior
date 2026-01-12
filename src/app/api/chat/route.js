import OpenAI from 'openai';
import { withAuth } from '@/middleware/authMiddleware';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// Junior system prompts by state
const JUNIOR_NEW_PROMPT = `You are a helpful onboarding assistant for new junior developers on Senior-Junior platform.

User State: NEW (no connections, no sessions)

Your role is to guide new users through their first steps:

1. **Getting Started**: Guide them to:
   - Browse senior developers by skills using "Find Developers"
   - Send connection requests to mentors they're interested in
   - Wait for mentor acceptance before booking sessions

2. **First Actions**: 
   - "Start by clicking 'Find Developers' in the navigation"
   - "Filter by your tech stack (e.g., React, Node.js, Python)"
   - "Click 'Send Request' on mentors you want to learn from"

3. **What to Expect**:
   - Mentors typically respond within 24 hours
   - Once accepted, you can book 1-on-1 sessions
   - Sessions are 30-60 minutes of focused guidance

Keep responses encouraging and step-by-step. Focus on platform actions, not generic advice.`;

const JUNIOR_ACTIVE_PROMPT = `You are a helpful guidance assistant for junior developers on Senior-Junior platform.

User State: ACTIVE (has connections, no sessions booked)

Your role is to help users move from connections to actual learning:

1. **Next Steps**: Guide them to:
   - Book sessions with their connected mentors
   - Prepare questions for mentoring sessions
   - Use messaging to coordinate with mentors

2. **Session Booking**:
   - "Go to 'Sessions' tab and click 'Book Session'"
   - "Select your mentor and available time slot"
   - "Add specific topics you want to discuss"

3. **Preparation Tips**:
   - "Prepare 3-5 specific questions before the session"
   - "Share your current project or challenges"
   - "Be ready to screen share if needed"

Keep responses action-oriented and focused on booking and preparing for sessions.`;

const JUNIOR_BOOKED_PROMPT = `You are a helpful session assistant for junior developers on Senior-Junior platform.

User State: BOOKED (has upcoming sessions)

Your role is to help users make the most of their upcoming sessions:

1. **Session Preparation**:
   - "Review your session topics and prepare questions"
   - "Test your camera and microphone before the session"
   - "Have your code/project ready to share"

2. **During Session**:
   - "Take notes on key advice and action items"
   - "Ask for clarification if you don't understand something"
   - "Record next steps and follow-up tasks"

3. **After Session**:
   - "Implement the advice you received"
   - "Send a thank you message to your mentor"
   - "Book a follow-up session if needed"

4. **Ongoing Learning**:
   - "Practice what you learned between sessions"
   - "Build small projects to reinforce concepts"
   - "Ask for code reviews in messages"

Keep responses focused on session success and continuous learning.`;

// Senior system prompts by state
const SENIOR_IDLE_PROMPT = `You are a professional mentor assistant for senior developers on Senior-Junior platform.

User State: IDLE (no pending requests)

Your role is to help mentors attract and manage junior developers:

1. **Profile Optimization**:
   - "Update your skills and expertise in Profile section"
   - "Add specific technologies you can mentor (e.g., React, Node.js, Python)"
   - "Write a clear bio about your mentoring approach"

2. **Attracting Mentees**:
   - "Keep your availability updated in Profile"
   - "Share your industry experience and specializations"
   - "Set clear expectations for mentoring style"

3. **Getting Started**:
   - "You'll receive notifications when juniors send requests"
   - "Review requests in the 'Requests' tab"
   - "Accept requests that match your expertise"

Keep responses professional and focused on building an effective mentor profile.`;

const SENIOR_PENDING_PROMPT = `You are a professional mentor assistant for senior developers on Senior-Junior platform.

User State: PENDING (has pending connection requests)

Your role is to help mentors manage incoming requests effectively:

1. **Review Requests**:
   - "Check 'Requests' tab to see pending connections"
   - "Review each junior's profile and goals"
   - "Consider if their needs match your expertise"

2. **Accepting Requests**:
   - "Accept requests where you can provide real value"
   - "Send a welcome message after accepting"
   - "Set expectations for response times and availability"

3. **Managing Multiple Requests**:
   - "Don't accept more than 3-5 mentees at once"
   - "Prioritize based on your availability and expertise"
   - "Politely decline if you're at capacity"

4. **First Interaction**:
   - "Ask about their current projects and goals"
   - "Share your mentoring approach and availability"
   - "Suggest booking an initial session"

Keep responses professional and focused on effective mentor management.`;

const SENIOR_ACTIVE_PROMPT = `You are a professional mentor assistant for senior developers on Senior-Junior platform.

User State: ACTIVE (currently mentoring)

Your role is to help mentors provide effective ongoing guidance:

1. **Session Management**:
   - "Track upcoming sessions in 'Sessions' tab"
   - "Prepare topics based on mentee progress"
   - "Set clear agendas for each session"

2. **Effective Mentoring**:
   - "Provide actionable feedback with specific examples"
   - "Share code reviews and best practices"
   - "Give homework or next steps between sessions"

3. **Communication**:
   - "Respond to messages within 24 hours"
   - "Provide quick code help via Messages"
   - "Share resources and learning materials"

4. **Long-term Growth**:
   - "Track mentee progress over time"
   - "Adjust mentoring approach as needed"
   - "Help them build real projects and portfolio pieces"

Keep responses professional and focused on mentoring effectiveness and mentee success.`;

// Helper function to get user state
async function getUserState(user, dbConnected) {
  if (!dbConnected) {
    // Fallback for development mode
    return user.role === 'junior' ? 'new' : 'idle';
  }

  try {
    // Get user's connections and sessions
    const connections = await User.findById(user._id)
      .populate('connections')
      .populate('sessions');
    
    if (user.role === 'junior') {
      const hasConnections = connections.connections && connections.connections.length > 0;
      const hasSessions = connections.sessions && connections.sessions.length > 0;
      
      if (!hasConnections) return 'new';
      if (hasConnections && !hasSessions) return 'active';
      if (hasSessions) return 'booked';
    } else {
      // For seniors, we'd need to check pending requests
      // This is a simplified version - in production you'd check requests collection
      return 'active'; // Default to active for seniors
    }
  } catch (error) {
    console.error('Error getting user state:', error);
    return user.role === 'junior' ? 'new' : 'idle';
  }
}

// Page-specific prompt enhancer
function enhancePromptForPage(basePrompt, currentPage, userRole, userState) {
  const pageContext = `
  
CURRENT PAGE CONTEXT: ${currentPage.toUpperCase()}

Page-specific guidance:
${getPageSpecificGuidance(currentPage, userRole, userState)}`;

  return basePrompt + pageContext;
}

function getPageSpecificGuidance(page, role, state) {
  const guidance = {
    dashboard: {
      junior: {
        new: `
- Guide user to "Find Developers" to discover mentors
- Explain stats cards and what they mean
- Suggest next steps based on their current state`,
        active: `
- Guide user to book sessions with connected mentors
- Help them understand their dashboard metrics
- Suggest preparing for upcoming sessions`,
        booked: `
- Help them prepare for upcoming sessions
- Guide them to review session details
- Suggest messaging mentors with questions`
      },
      senior: {
        idle: `
- Help optimize their profile to attract mentees
- Explain dashboard metrics and engagement
- Guide them to update availability and skills`,
        pending: `
- Guide them to review pending requests
- Help manage connection requests effectively
- Suggest responding to requests promptly`,
        active: `
- Help track upcoming sessions and mentee progress
- Guide them to manage their mentoring schedule
- Suggest checking messages from mentees`
      }
    },
    find_developers: {
      junior: {
        new: `
- Explain how to use filters (skills, experience, availability)
- Guide them through viewing mentor profiles
- Help them understand how to send connection requests`,
        active: `
- Help them find additional mentors for different skills
- Guide them to compare mentor profiles
- Suggest sending requests to mentors with specific expertise`,
        booked: `
- Help them find mentors for additional skill areas
- Guide them to explore different mentoring approaches
- Suggest expanding their mentor network`
      },
      senior: {
        idle: `
- This page is for juniors - guide them back to dashboard
- Suggest they update their profile to appear here
- Explain how juniors will discover them`,
        pending: `
- Guide them back to dashboard to manage requests
- Explain how their profile appears to juniors
- Suggest updating their profile to attract better matches`,
        active: `
- Guide them back to dashboard for current mentees
- Explain their visibility to potential mentees
- Suggest profile updates based on mentee feedback`
      }
    },
    mentor_profile: {
      junior: {
        new: `
- Explain how to evaluate mentor profiles
- Guide them to check skills, experience, and reviews
- Help them understand when to send a connection request`,
        active: `
- Help them assess if this mentor matches their goals
- Guide them to book a session if already connected
- Suggest specific questions to ask this mentor`,
        booked: `
- Help them prepare for sessions with this mentor
- Guide them to review mentor's expertise areas
- Suggest topics to discuss based on mentor's background`
      },
      senior: {
        idle: `
- Help them optimize their own profile (if viewing their own)
- Guide them to update skills, bio, and availability
- Suggest adding specific mentoring topics`,
        pending: `
- Help them understand how their profile appears to juniors
- Guide them to update profile to attract right mentees
- Suggest setting clear expectations in their bio`,
        active: `
- Help them update profile based on mentee feedback
- Guide them to reflect current expertise and availability
- Suggest adding recent mentoring success stories`
      }
    },
    chat: {
      junior: {
        new: `
- Help them craft good introductory messages
- Suggest questions to ask potential mentors
- Guide them on professional communication etiquette`,
        active: `
- Help them prepare for mentoring sessions
- Suggest topics to discuss with connected mentors
- Guide them on sharing progress and asking for help`,
        booked: `
- Help them communicate with upcoming session mentors
- Suggest pre-session questions and topics
- Guide them on sharing materials for review`
      },
      senior: {
        idle: `
- Help them respond to junior inquiries
- Guide them on setting communication expectations
- Suggest professional mentoring communication style`,
        pending: `
- Help them respond to connection requests
- Guide them on evaluating junior developer needs
- Suggest setting initial mentoring expectations`,
        active: `
- Help them provide effective guidance via chat
- Guide them on giving constructive feedback
- Suggest sharing resources and learning materials`
      }
    },
    sessions: {
      junior: {
        new: `
- Explain they need to connect with mentors first
- Guide them back to Find Developers
- Help them understand the session booking process`,
        active: `
- Guide them to book sessions with connected mentors
- Explain how to choose time slots and topics
- Help them prepare for upcoming sessions`,
        booked: `
- Help them prepare for scheduled sessions
- Guide them on session etiquette and preparation
- Suggest topics and questions for each session`
      },
      senior: {
        idle: `
- Guide them to update availability in profile
- Explain how juniors will book sessions
- Help them set up their mentoring schedule`,
        pending: `
- Guide them to set availability for sessions
- Help them prepare for upcoming mentoring sessions
- Suggest structuring their session time effectively`,
        active: `
- Help them manage their session schedule
- Guide them on preparing for each mentee session
- Suggest tracking mentee progress across sessions`
      }
    }
  };

  return guidance[page]?.[role]?.[state] || "Provide general platform guidance and suggest relevant actions.";
}

// Generate CTA suggestions based on context
function generateCTAs(currentPage, userRole, userState, messageContent) {
  const ctas = [];

  // Define possible CTAs based on page and user state
  const ctaMap = {
    dashboard: {
      junior: {
        new: [
          { label: "Find Developers", action: "NAVIGATE", path: "/find-developers" },
          { label: "View Profile", action: "NAVIGATE", path: "/profile" }
        ],
        active: [
          { label: "Book Session", action: "NAVIGATE", path: "/sessions" },
          { label: "View Messages", action: "NAVIGATE", path: "/chat" }
        ],
        booked: [
          { label: "View Sessions", action: "NAVIGATE", path: "/sessions" },
          { label: "Message Mentor", action: "NAVIGATE", path: "/chat" }
        ]
      },
      senior: {
        idle: [
          { label: "Update Profile", action: "NAVIGATE", path: "/profile" },
          { label: "View Requests", action: "NAVIGATE", path: "/requests" }
        ],
        pending: [
          { label: "Review Requests", action: "NAVIGATE", path: "/requests" },
          { label: "Update Availability", action: "NAVIGATE", path: "/profile" }
        ],
        active: [
          { label: "View Sessions", action: "NAVIGATE", path: "/sessions" },
          { label: "View Messages", action: "NAVIGATE", path: "/chat" }
        ]
      }
    },
    find_developers: {
      junior: {
        new: [
          { label: "Filter by Skills", action: "FILTER", path: "skills" },
          { label: "Send Request", action: "REQUEST", path: "connect" }
        ],
        active: [
          { label: "View Profile", action: "VIEW", path: "profile" },
          { label: "Send Request", action: "REQUEST", path: "connect" }
        ],
        booked: [
          { label: "Book Session", action: "NAVIGATE", path: "/sessions" },
          { label: "View Profile", action: "VIEW", path: "profile" }
        ]
      }
    },
    mentor_profile: {
      junior: {
        new: [
          { label: "Send Request", action: "REQUEST", path: "connect" },
          { label: "View Reviews", action: "VIEW", path: "reviews" }
        ],
        active: [
          { label: "Book Session", action: "NAVIGATE", path: "/sessions" },
          { label: "Send Message", action: "NAVIGATE", path: "/chat" }
        ],
        booked: [
          { label: "View Sessions", action: "NAVIGATE", path: "/sessions" },
          { label: "Send Message", action: "NAVIGATE", path: "/chat" }
        ]
      }
    },
    chat: {
      junior: {
        new: [
          { label: "Find Developers", action: "NAVIGATE", path: "/find-developers" },
          { label: "View Profile", action: "NAVIGATE", path: "/profile" }
        ],
        active: [
          { label: "Book Session", action: "NAVIGATE", path: "/sessions" },
          { label: "Find More Mentors", action: "NAVIGATE", path: "/find-developers" }
        ],
        booked: [
          { label: "View Sessions", action: "NAVIGATE", path: "/sessions" },
          { label: "Prepare Questions", action: "GUIDE", path: "prepare" }
        ]
      },
      senior: {
        idle: [
          { label: "Update Profile", action: "NAVIGATE", path: "/profile" },
          { label: "Set Availability", action: "NAVIGATE", path: "/profile" }
        ],
        pending: [
          { label: "Review Requests", action: "NAVIGATE", path: "/requests" },
          { label: "Update Profile", action: "NAVIGATE", path: "/profile" }
        ],
        active: [
          { label: "View Sessions", action: "NAVIGATE", path: "/sessions" },
          { label: "View Messages", action: "NAVIGATE", path: "/chat" }
        ]
      }
    },
    sessions: {
      junior: {
        new: [
          { label: "Find Developers", action: "NAVIGATE", path: "/find-developers" },
          { label: "View Connections", action: "NAVIGATE", path: "/dashboard" }
        ],
        active: [
          { label: "Book Session", action: "BOOK", path: "schedule" },
          { label: "View Mentors", action: "NAVIGATE", path: "/find-developers" }
        ],
        booked: [
          { label: "Join Session", action: "JOIN", path: "session-room" },
          { label: "Message Mentor", action: "NAVIGATE", path: "/chat" }
        ]
      },
      senior: {
        idle: [
          { label: "Update Availability", action: "NAVIGATE", path: "/profile" },
          { label: "View Profile", action: "NAVIGATE", path: "/profile" }
        ],
        pending: [
          { label: "Set Availability", action: "NAVIGATE", path: "/profile" },
          { label: "Review Requests", action: "NAVIGATE", path: "/requests" }
        ],
        active: [
          { label: "Start Session", action: "JOIN", path: "session-room" },
          { label: "View Schedule", action: "VIEW", path: "calendar" }
        ]
      }
    }
  };

  const possibleCTAs = ctaMap[currentPage]?.[userRole]?.[userState] || [];
  
  // Return 1-2 most relevant CTAs based on message content
  return possibleCTAs.slice(0, 2);
}

// Wrap POST handler with authentication middleware
export const POST = withAuth(async function POST(req) {
  try {
    const { messages, page } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user role and state
    const userRole = req.user?.role || 'junior';
    const currentPage = page || 'dashboard'; // Default to dashboard if no page provided
    
    // Try to connect to database for state detection
    let dbConnected = false;
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
    }

    // Get user state based on role and data
    const userState = await getUserState(req.user, dbConnected);
    
    // Select appropriate system prompt based on role and state
    let basePrompt;
    if (userRole === 'junior') {
      switch (userState) {
        case 'new':
          basePrompt = JUNIOR_NEW_PROMPT;
          break;
        case 'active':
          basePrompt = JUNIOR_ACTIVE_PROMPT;
          break;
        case 'booked':
          basePrompt = JUNIOR_BOOKED_PROMPT;
          break;
        default:
          basePrompt = JUNIOR_NEW_PROMPT; // Fallback
      }
    } else {
      switch (userState) {
        case 'idle':
          basePrompt = SENIOR_IDLE_PROMPT;
          break;
        case 'pending':
          basePrompt = SENIOR_PENDING_PROMPT;
          break;
        case 'active':
          basePrompt = SENIOR_ACTIVE_PROMPT;
          break;
        default:
          basePrompt = SENIOR_IDLE_PROMPT; // Fallback
      }
    }
    
    // Enhance prompt with page-specific context
    const systemPrompt = enhancePromptForPage(basePrompt, currentPage, userRole, userState);
    
    console.log(`Using ${userRole} role with ${userState} state on ${currentPage} page for chat request`);

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    // Generate relevant CTAs based on context
    const ctas = generateCTAs(currentPage, userRole, userState, reply);

    // Return structured response
    const response = {
      message: reply,
      cta: ctas.length > 0 ? ctas : undefined
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
