const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
    lowercase: true,
  }],
  category: {
    type: String,
    required: true,
    lowercase: true,
  },
  readTime: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  // AI Summary fields
  aiSummary: {
    type: String,
    default: null,
  },
  aiSummaryMeta: {
    generatedAt: {
      type: Date,
      default: null,
    },
    model: {
      type: String,
      default: null,
    },
    roleAdapted: {
      type: Boolean,
      default: false,
    },
    // Prepare for future embeddings
    embeddingId: {
      type: String,
      default: null,
    },
    relatedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }],
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for faster lookups
blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });

module.exports = mongoose.model('Blog', blogSchema);
