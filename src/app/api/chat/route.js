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

// Wrap the POST handler with authentication middleware
export const POST = withAuth(async function POST(req) {
  try {
    const { messages } = await req.json();

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
    let systemPrompt;
    if (userRole === 'junior') {
      switch (userState) {
        case 'new':
          systemPrompt = JUNIOR_NEW_PROMPT;
          break;
        case 'active':
          systemPrompt = JUNIOR_ACTIVE_PROMPT;
          break;
        case 'booked':
          systemPrompt = JUNIOR_BOOKED_PROMPT;
          break;
        default:
          systemPrompt = JUNIOR_NEW_PROMPT; // Fallback
      }
    } else {
      switch (userState) {
        case 'idle':
          systemPrompt = SENIOR_IDLE_PROMPT;
          break;
        case 'pending':
          systemPrompt = SENIOR_PENDING_PROMPT;
          break;
        case 'active':
          systemPrompt = SENIOR_ACTIVE_PROMPT;
          break;
        default:
          systemPrompt = SENIOR_IDLE_PROMPT; // Fallback
      }
    }
    
    console.log(`Using ${userRole} role with ${userState} state for chat request`);

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

    return new Response(JSON.stringify({ text: reply }), {
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
