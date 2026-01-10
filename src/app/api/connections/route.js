import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
import User from '@/models/User';
import { withAuth } from '@/middleware/authMiddleware';

async function getHandler(request) {
  try {
    // Connect to database and authentication are handled by middleware
    const userId = request.user._id;
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type'); // 'sent' or 'received'
    
    // Build query
    let query = {};
    
    if (type === 'sent') {
      query.requesterId = userId;
    } else if (type === 'received') {
      query.recipientId = userId;
    } else {
      // If no type specified, get both sent and received
      query = {
        $or: [
          { requesterId: userId },
          { recipientId: userId }
        ]
      };
    }
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    // Find connections
    const connections = await Connection.find(query)
      .populate('requesterId', 'username email role skills bio')
      .populate('recipientId', 'username email role skills bio')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ connections }, { status: 200 });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch connections', 
      message: error.message 
    }, { status: 500 });
  }
}

async function postHandler(request) {
  try {
    // Connect to database and authentication are handled by middleware
    await connectDB();
    
    const requesterId = request.user._id;
    console.log('Connection request from user:', requesterId);
    
    // Parse request body
    const data = await request.json();
    console.log('Connection request data:', data);
    
    // Support both recipientId and toId for backward compatibility
    const recipientId = data.recipientId || data.toId;
    
    if (!recipientId) {
      return NextResponse.json({ error: 'Recipient ID is required' }, { status: 400 });
    }
    
    console.log('Connecting user', requesterId, 'to user', recipientId);
    
    // Check if users exist
    const requester = await User.findById(requesterId);
    const recipient = await User.findById(recipientId);
    
    if (!requester) {
      console.error('Requester not found:', requesterId);
      return NextResponse.json({ error: 'Requester not found' }, { status: 404 });
    }
    
    if (!recipient) {
      console.error('Recipient not found:', recipientId);
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }
    
    console.log('Found both users:', requester.username, 'and', recipient.username);
    
    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requesterId, recipientId },
        { requesterId: recipientId, recipientId: requesterId }
      ]
    });
    
    if (existingConnection) {
      console.log('Connection already exists with status:', existingConnection.status);
      return NextResponse.json({ 
        error: 'Connection already exists', 
        status: existingConnection.status,
        connection: existingConnection
      }, { status: 400 });
    }
    
    // Create new connection
    const connection = new Connection({
      requesterId,
      recipientId,
      status: 'pending'
    });
    
    await connection.save();
    console.log('Connection created with ID:', connection._id);
    
    // Populate user details
    await connection.populate('requesterId', 'username email role skills bio');
    await connection.populate('recipientId', 'username email role skills bio');
    
    return NextResponse.json({ 
      message: 'Connection request sent successfully', 
      connection 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating connection:', error);
    return NextResponse.json({ 
      error: 'Failed to create connection', 
      message: error.message 
    }, { status: 500 });
  }
}

// Apply authentication middleware
export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
