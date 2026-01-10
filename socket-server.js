const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { createAdapter } = require('@socket.io/mongo-adapter');
const { MongoClient } = require('mongodb');

// Load environment variables
dotenv.config({ path: './.env.local' });

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://192.168.1.2:3000',
      process.env.NEXT_PUBLIC_FRONTEND_URL
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  
  // Set up MongoDB adapter for Socket.io (for better scalability)
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  mongoClient.connect().then(() => {
    const mongoCollection = mongoClient.db('senior-junior-connect').collection('socket.io-adapter-events');
    io.adapter(createAdapter(mongoCollection));
    console.log('Socket.io MongoDB adapter initialized');
  }).catch(err => {
    console.error('Socket.io MongoDB adapter error:', err);
  });
})
.catch(err => console.error('MongoDB connection error:', err));

// Import models
// We need to define the models here since this is a separate server
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  skills: [String],
  bio: String
});

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  read: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// Authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }
    
    // Attach user info to socket
    socket.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    return next(new Error(`Authentication error: ${error.message}`));
  }
};

// Apply authentication middleware to Socket.io
io.use(authenticateSocket);

// Socket.io connection handler
// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.id}`);
  
  // Add user to online users
  onlineUsers.set(socket.user.id.toString(), socket.id);
  
  // Broadcast user online status
  io.emit('userOnline', { userId: socket.user.id });
  
  // Send current online users to the newly connected user
  socket.emit('onlineUsers', { users: Array.from(onlineUsers.keys()) });
  
  // Join a conversation room
  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.user.id} joined room: ${conversationId}`);
    
    // Notify others in the room that this user joined
    socket.to(conversationId).emit('userJoinedRoom', {
      userId: socket.user.id,
      username: socket.user.username
    });
  });
  
  // Leave a conversation room
  socket.on('leaveRoom', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.user.id} left room: ${conversationId}`);
    
    // Notify others in the room that this user left
    socket.to(conversationId).emit('userLeftRoom', {
      userId: socket.user.id,
      username: socket.user.username
    });
  });
  
  // Handle new message
  socket.on('sendMessage', async (messageData) => {
    try {
      const { receiverId, content, conversationId } = messageData;
      
      // Create and save new message
      const message = new Message({
        senderId: socket.user.id,
        receiverId,
        content,
        conversationId,
        timestamp: new Date()
      });
      
      await message.save();
      
      // Emit the message to the conversation room
      io.to(conversationId).emit('receiveMessage', {
        _id: message._id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        conversationId: message.conversationId,
        timestamp: message.timestamp,
        read: message.read
      });
      
      console.log(`Message sent in conversation ${conversationId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Error sending message' });
    }
  });
  
  // Mark messages as read
  socket.on('markAsRead', async (data) => {
    try {
      const { conversationId, userId } = data;
      
      // Update all unread messages in this conversation sent to this user
      await Message.updateMany(
        { 
          conversationId, 
          receiverId: userId,
          read: false
        },
        { read: true }
      );
      
      // Notify the conversation room that messages have been read
      io.to(conversationId).emit('messagesRead', { conversationId, userId });
      
      console.log(`Messages marked as read in conversation ${conversationId} for user ${userId}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      socket.emit('error', { message: 'Error marking messages as read' });
    }
  });
  
  // Handle typing indicator
  socket.on('typing', (data) => {
    const { conversationId, isTyping } = data;
    
    // Broadcast typing status to the conversation room (except sender)
    socket.to(conversationId).emit('userTyping', {
      userId: socket.user.id,
      isTyping
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.id}`);
    
    // Remove user from online users
    onlineUsers.delete(socket.user.id.toString());
    
    // Broadcast user offline status
    io.emit('userOffline', { userId: socket.user.id });
  });
  
  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`Socket error for user ${socket.user.id}:`, error);
  });
  
  // Handle new connection notification
  socket.on('newConnection', async ({ connectionId }) => {
    try {
      // Find the connection details
      const connection = await mongoose.model('Connection').findById(connectionId)
        .populate('requesterId', 'username _id')
        .populate('recipientId', 'username _id');
      
      if (!connection) {
        return socket.emit('error', { message: 'Connection not found' });
      }
      
      // Notify the recipient of the new connection request
      const recipientSocketId = onlineUsers.get(connection.recipientId._id.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('connectionRequest', {
          connection,
          from: connection.requesterId.username
        });
      }
    } catch (error) {
      console.error('Error sending connection notification:', error);
      socket.emit('error', { message: 'Error sending connection notification' });
    }
  });
  
  // Handle connection status update
  socket.on('connectionUpdate', async ({ connectionId, status }) => {
    try {
      // Find the connection details
      const connection = await mongoose.model('Connection').findById(connectionId)
        .populate('requesterId', 'username _id')
        .populate('recipientId', 'username _id');
      
      if (!connection) {
        return socket.emit('error', { message: 'Connection not found' });
      }
      
      // Notify the requester of the connection status update
      const requesterSocketId = onlineUsers.get(connection.requesterId._id.toString());
      if (requesterSocketId) {
        io.to(requesterSocketId).emit('connectionUpdated', {
          connectionId,
          status,
          with: connection.recipientId.username
        });
      }
    } catch (error) {
      console.error('Error sending connection update notification:', error);
      socket.emit('error', { message: 'Error sending connection update notification' });
    }
  });
});

// API endpoint to test server status
app.get('/', (req, res) => {
  res.json({ message: 'Socket.io server is running' });
});

// Start server
const PORT = process.env.SOCKET_PORT || 5001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
