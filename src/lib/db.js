import mongoose from 'mongoose';
import connectMockDB from './mock-db';

// MongoDB connection URLs
const MONGODB_URI = process.env.MONGODB_URI;
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/senior-junior-connect';
// When USE_MOCK_FALLBACK is set to 'true' we will gracefully fall back to an in-memory DB.
// Otherwise, the request will error out so the issue is visible during development.
const USE_MOCK_FALLBACK = process.env.USE_MOCK_FALLBACK === 'true';

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not defined in .env.local, will use mock database');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      family: 4,
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 5000,
      retryWrites: true,
      w: 'majority'
    };
    
    console.log('Attempting to connect to MongoDB...');
    
    // Try Atlas connection first, then fall back to mock DB
    cached.promise = mongoose.connect(MONGODB_URI || LOCAL_MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        global.__USE_MOCK_DB = false;
        return mongoose;
      })
      .catch(err => {
        console.error('❌ MongoDB connection failed:', err);
        if (!USE_MOCK_FALLBACK) {
          // Re-throw so calling route can return proper 500 instead of confusing messages
          throw err;
        }
        console.warn('⚠️  Falling back to in-memory mock database because USE_MOCK_FALLBACK=true');
        // Mark that we are using the mock DB so other modules can adapt their behaviour
        global.__USE_MOCK_DB = true;
        // Use mock database as fallback
        return connectMockDB();
      });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
