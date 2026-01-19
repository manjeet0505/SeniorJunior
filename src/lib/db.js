import mongoose from 'mongoose';

function getSafeMongoUri(uri) {
  try {
    const url = new URL(uri);
    if (url.password) url.password = '***';
    if (url.username) url.username = '***';
    return url.toString();
  } catch {
    // Fallback for non-standard URIs. Avoid logging secrets.
    return uri.startsWith('mongodb+srv://') ? 'mongodb+srv://***' : uri;
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI. MongoDB Atlas connection string is required.');
  }

  if (!MONGODB_URI.startsWith('mongodb+srv://')) {
    throw new Error(`Refusing to connect: MONGODB_URI must be a MongoDB Atlas (mongodb+srv) URI. Got: ${getSafeMongoUri(MONGODB_URI)}`);
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, 
    };

    console.log(`Attempting to connect to MongoDB at ${getSafeMongoUri(MONGODB_URI)}...`);

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      cached.promise = null; // Reset promise on failure
      throw err; // Re-throw to be caught by the calling function
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
