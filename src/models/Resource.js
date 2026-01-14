import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'DSA', 'AI'],
      required: [true, 'Category is required'],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Difficulty is required'],
    },
    type: {
      type: String,
      enum: ['Docs', 'Course', 'Practice', 'Video'],
      required: [true, 'Type is required'],
    },
    skills: {
      type: [String],
      default: [],
    },
    aiSummary: {
      type: String,
      default: '',
      trim: true,
    },
    recommendedForJuniorsBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    juniorBenefitCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ResourceSchema.index({ title: 'text', description: 'text', skills: 'text' });
ResourceSchema.index({ category: 1, difficulty: 1, type: 1, isActive: 1 });

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
