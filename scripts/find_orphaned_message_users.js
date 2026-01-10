// Script to find user IDs in messages that are missing from the users collection
import mongoose from 'mongoose';
import Message from '../src/models/Message.js';
import User from '../src/models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_URI_HERE';

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
    console.log('All referenced users exist in the users collection.');
  } else {
    console.log('Orphaned user IDs (referenced in messages but missing from users collection):');
    orphaned.forEach(id => console.log(id));
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error running orphaned user check:', err);
  process.exit(1);
});
