import mongoose from 'mongoose';

// MongoDB connection URLs
const MONGODB_URI = process.env.MONGODB_URI;
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/senior-junior-connect';

// Cache connection
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with fallback to local database
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // Try to connect to the primary MongoDB URI first
    console.log('Attempting to connect to primary MongoDB...');
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('✅ Connected to primary MongoDB successfully');
          return mongoose;
        });
    } catch (error) {
      console.error('❌ Primary MongoDB connection failed:', error);
      
      // If primary connection fails, try local MongoDB
      console.log('Attempting to connect to local MongoDB fallback...');
      cached.promise = mongoose.connect(LOCAL_MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('✅ Connected to local MongoDB fallback successfully');
          return mongoose;
        })
        .catch(localError => {
          console.error('❌ Local MongoDB connection also failed:', localError);
          console.error('Please ensure you have MongoDB running locally or fix your connection string');
          throw localError;
        });
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to establish any MongoDB connection:', error);
    throw error;
  }
}

export default connectDB;
