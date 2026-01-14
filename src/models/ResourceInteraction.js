import mongoose from 'mongoose';

const ResourceInteractionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Resource ID is required'],
      index: true,
    },
    saved: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    lastViewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

ResourceInteractionSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

export default mongoose.models.ResourceInteraction ||
  mongoose.model('ResourceInteraction', ResourceInteractionSchema);
