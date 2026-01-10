import mongoose from 'mongoose';
import User from '@/models/User';
import Connection from '@/models/Connection';
import Message from '@/models/Message';

// In-memory mock database
const mockDB = {
  users: [
    {
      _id: '507f1f77bcf86cd799439011',
      id: '507f1f77bcf86cd799439011', // Add id field for easier access
      username: 'senior_dev',
      email: 'senior@example.com',
      password: '$2b$10$XdUHGJcj3Nj9GP/6zGCOxu.mIL9L9XwPEKxvRHEDQgR9zyji.iy1K', // hashed 'password123'
      role: 'senior',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      bio: 'Senior developer with 5+ years of experience in web development.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '507f1f77bcf86cd799439012',
      id: '507f1f77bcf86cd799439012', // Add id field for easier access
      username: 'junior_dev',
      email: 'junior@example.com',
      password: '$2b$10$XdUHGJcj3Nj9GP/6zGCOxu.mIL9L9XwPEKxvRHEDQgR9zyji.iy1K', // hashed 'password123'
      role: 'junior',
      skills: ['JavaScript', 'HTML', 'CSS'],
      bio: 'Junior developer eager to learn and grow.',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  connections: [
    {
      _id: '607f1f77bcf86cd799439013',
      requesterId: '507f1f77bcf86cd799439012',
      recipientId: '507f1f77bcf86cd799439011',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  messages: []
};

// Initialize mock models with methods similar to Mongoose
class MockModel {
  constructor(collection) {
    this.collection = collection;
  }

  async find(query = {}) {
    return this.collection.filter(item => {
      return Object.keys(query).every(key => {
        if (key === '$or') {
          return query[key].some(orCondition => {
            return Object.keys(orCondition).every(orKey => {
              return orCondition[orKey] === item[orKey];
            });
          });
        }
        return query[key] === item[key];
      });
    });
  }

  async findOne(query = {}) {
    return this.find(query).then(results => results[0] || null);
  }

  async findById(id) {
    // Handle both string IDs and object IDs
    const stringId = id?.toString() || id;
    const result = this.collection.find(item => 
      item._id?.toString() === stringId || item.id?.toString() === stringId
    );
    return Promise.resolve(result || null);
  }

  async create(data) {
    const newItem = {
      _id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.collection.push(newItem);
    return newItem;
  }

  async save() {
    return this;
  }

  select() {
    return this;
  }

  populate() {
    return this;
  }
}

// Mock connection function
async function connectMockDB() {
  console.log('Using mock in-memory database');
  
  // Replace mongoose models with mock models
  global.User = new MockModel(mockDB.users);
  global.Connection = new MockModel(mockDB.connections);
  global.Message = new MockModel(mockDB.messages);
  
  return {
    connection: {
      db: {
        collection: (name) => {
          switch (name) {
            case 'users':
              return global.User;
            case 'connections':
              return global.Connection;
            case 'messages':
              return global.Message;
            default:
              return new MockModel([]);
          }
        }
      }
    }
  };
}

// Function to get mock users for authentication fallback
export function getMockUsers() {
  // Add plaintext passwords for mock authentication
  return mockDB.users.map(user => ({
    ...user,
    // For mock users in development, we'll use a simple password
    password: 'password123'
  }));
}

export default connectMockDB;
