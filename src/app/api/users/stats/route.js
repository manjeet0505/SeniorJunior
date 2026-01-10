import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { withAuth } from '@/middleware/authMiddleware';
import Connection from '@/models/Connection';
import Message from '@/models/Message';

/**
 * GET /api/users/stats
 * Get user statistics (connections, pending requests, unread messages)
 */
async function handler(request) {
  const startTime = Date.now();
  // Helper to timeout a promise
  function timeoutPromise(promise, ms, timeoutMsg) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(timeoutMsg)), ms))
    ]);
  }
  try {
    // Timeout DB connection after 6 seconds
    await timeoutPromise(connectDB(), 6000, 'Database connection timed out');
    const userId = request.user._id;

    // Run all 3 queries in parallel with timeout
    const [connectionsCount, pendingRequestsCount, unreadMessagesCount] = await timeoutPromise(Promise.all([
      Connection.countDocuments({
        $or: [
          { requesterId: userId, status: 'accepted' },
          { recipientId: userId, status: 'accepted' }
        ]
      }),
      Connection.countDocuments({
        recipientId: userId,
        status: 'pending'
      }),
      Message.countDocuments({
        receiverId: userId,
        read: false
      })
    ]), 6000, 'Database query timed out');

    const elapsed = Date.now() - startTime;
    console.log(`[STATS API] Success in ${elapsed}ms`);
    return NextResponse.json({
      connections: connectionsCount,
      pendingRequests: pendingRequestsCount,
      messages: unreadMessagesCount
    }, { status: 200 });
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[STATS API] Error after ${elapsed}ms:`, error);
    // If fallback is enabled, return mock data
    if (process.env.USE_MOCK_FALLBACK === 'true' || global.__USE_MOCK_DB) {
      return NextResponse.json({
        connections: 0,
        pendingRequests: 0,
        messages: 0,
        fallback: true,
        error: 'Database unavailable, showing fallback data.'
      }, { status: 200 });
    }
    return NextResponse.json({ 
      error: 'Failed to fetch user statistics.' 
    }, { status: 500 });
  }
}

// Apply authentication middleware
export const GET = withAuth(handler);
