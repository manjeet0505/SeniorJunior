import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Connection from '@/models/Connection';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
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
    
    const { id } = await params;
    
    // Find connection
    const connection = await Connection.findById(id);
    
    if (!connection) {
      return NextResponse.json({ error: 'Connection request not found' }, { status: 404 });
    }
    
    // Check if user is the recipient of the connection request
    if (connection.recipientId.toString() !== userId) {
      return NextResponse.json({ error: 'Not authorized to accept this connection request' }, { status: 403 });
    }
    
    // Check if connection is already accepted or rejected
    if (connection.status !== 'pending') {
      return NextResponse.json({ 
        error: `Connection request is already ${connection.status}` 
      }, { status: 400 });
    }
    
    // Update connection status
    connection.status = 'accepted';
    await connection.save();
    
    // Populate user details
    await connection.populate('requesterId', 'username email role skills bio');
    await connection.populate('recipientId', 'username email role skills bio');
    
    return NextResponse.json({ 
      message: 'Connection request accepted successfully', 
      connection 
    }, { status: 200 });
  } catch (error) {
    console.error('Error accepting connection request:', error);
    return NextResponse.json({ error: 'Failed to accept connection request' }, { status: 500 });
  }
}
