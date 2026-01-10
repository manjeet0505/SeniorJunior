// Script to fix all messages and conversations that reference non-existent user IDs
import mongoose from 'mongoose';
import Message from '../src/models/Message.js';

const MONGO_URI = 'mongodb+srv://mishramanjeet2909:qeuh3Fpt8XsMvBtW@cluster0.r4e7m.mongodb.net/';

// List of valid user IDs in your DB
const validUserIds = [
  '685ef28b3c3d6f3d6bd6d3e4',
  '685ef2a73c3d6f3d6bd6d3f2',
  '685ef31b3c3d6f3d6bd6d3f6',
];

// Pick one as the default replacement for invalid user IDs
const DEFAULT_USER_ID = validUserIds[0];

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Find all messages with invalid senderId or receiverId
  const invalidSenderMessages = await Message.find({ senderId: { $nin: validUserIds } });
  const invalidReceiverMessages = await Message.find({ receiverId: { $nin: validUserIds } });

  // Update senderId
  for (const msg of invalidSenderMessages) {
    console.log(`Fixing senderId for message ${msg._id}: ${msg.senderId} -> ${DEFAULT_USER_ID}`);
    msg.senderId = DEFAULT_USER_ID;
    await msg.save();
  }

  // Update receiverId
  for (const msg of invalidReceiverMessages) {
    console.log(`Fixing receiverId for message ${msg._id}: ${msg.receiverId} -> ${DEFAULT_USER_ID}`);
    msg.receiverId = DEFAULT_USER_ID;
    await msg.save();
  }

  await mongoose.disconnect();
  console.log('All invalid message user IDs fixed.');
}

main().catch(err => {
  console.error('Error fixing message user IDs:', err);
  process.exit(1);
});
