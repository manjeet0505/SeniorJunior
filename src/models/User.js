import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['senior', 'junior'],
    required: [true, 'Please specify your role'],
  },
  skills: {
    type: [String],
    default: [],
  },
  learningSkills: {
    type: [String],
    default: [],
  },
  experienceLevel: {
    type: String,
    default: '',
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  lookingForMentorshipIn: {
    type: [String],
    default: [],
  },
  availability: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  status: {
    type: String,
    enum: ['open', 'busy', 'offline'],
    default: 'offline',
  },
  social: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: '',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
