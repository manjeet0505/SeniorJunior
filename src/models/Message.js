import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required'],
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver ID is required'],
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  conversationId: {
    type: String,
    required: [true, 'Conversation ID is required'],
    index: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
