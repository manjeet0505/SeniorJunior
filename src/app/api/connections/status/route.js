import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
import User from '@/models/User';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    // Connect to database
    await connectDB();
    
    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    let userId;
    try {
      const decoded = verifyToken(token);
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const fromId = searchParams.get('fromId');
    const toId = searchParams.get('toId');
    
    if (!fromId || !toId) {
      return NextResponse.json({ error: 'Both fromId and toId are required' }, { status: 400 });
    }
    
    // Check if user is authorized to check this connection status
    if (fromId !== userId) {
      return NextResponse.json({ error: 'Not authorized to check this connection status' }, { status: 403 });
    }
    
    // Find connection between these users
    let connection = null;
    
    // Only query if both IDs appear to be valid MongoDB ObjectIds
    if (fromId.match(/^[0-9a-fA-F]{24}$/) && (toId.match(/^[0-9a-fA-F]{24}$/) || await User.findOne({ username: toId }))) {
      // If toId is not an ObjectId, try to find the user by username
      let actualToId = toId;
      if (!toId.match(/^[0-9a-fA-F]{24}$/)) {
        const toUser = await User.findOne({ username: toId });
        if (toUser) {
          actualToId = toUser._id;
        }
      }
      
      connection = await Connection.findOne({
        $or: [
          { requesterId: fromId, recipientId: actualToId },
          { requesterId: actualToId, recipientId: fromId }
        ]
      });
    }
    
    if (!connection) {
      return NextResponse.json({ status: null }, { status: 200 });
    }
    
    return NextResponse.json({ status: connection.status }, { status: 200 });
  } catch (error) {
    console.error('Error checking connection status:', error);
    return NextResponse.json({ error: 'Failed to check connection status' }, { status: 500 });
  }
}
