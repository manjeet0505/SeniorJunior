// Script to fix messages with orphaned user IDs by reassigning them to an existing user or deleting them
import mongoose from 'mongoose';
import Message from '../src/models/Message.js';
import User from '../src/models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_URI_HERE';
// Set the userId to assign orphaned messages to (e.g., your admin or a default user)
const DEFAULT_USER_ID = 'PUT_A_VALID_EXISTING_USER_ID_HERE';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const allMessages = await Message.find({}, { senderId: 1, receiverId: 1 });
  const userIds = new Set();
  allMessages.forEach(msg => {
    if (msg.senderId) userIds.add(String(msg.senderId));
    if (msg.receiverId) userIds.add(String(msg.receiverId));
  });

  const users = await User.find({ _id: { $in: Array.from(userIds) } }, { _id: 1 });
  const userIdSet = new Set(users.map(u => String(u._id)));

  const orphaned = Array.from(userIds).filter(id => !userIdSet.has(id));

  if (orphaned.length === 0) {
    console.log('No orphaned user IDs found. No changes needed.');
    await mongoose.disconnect();
    return;
  }

  console.log('Fixing orphaned user IDs in messages...');
  // For each orphaned user, update messages to use DEFAULT_USER_ID
  for (const orphanId of orphaned) {
    const result1 = await Message.updateMany({ senderId: orphanId }, { senderId: DEFAULT_USER_ID });
    const result2 = await Message.updateMany({ receiverId: orphanId }, { receiverId: DEFAULT_USER_ID });
    console.log(`Updated messages for orphaned userId ${orphanId}: senderId->${result1.modifiedCount}, receiverId->${result2.modifiedCount}`);
  }

  await mongoose.disconnect();
  console.log('Orphaned user IDs fixed.');
}

main().catch(err => {
  console.error('Error running orphaned user fix:', err);
  process.exit(1);
});
