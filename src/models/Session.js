import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  sessionTime: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'canceled'],
    default: 'pending',
  },
}, { timestamps: true });

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;
