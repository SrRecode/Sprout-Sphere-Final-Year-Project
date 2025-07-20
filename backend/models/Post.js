const mongoose = require('mongoose');

// Comment Schema
const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Reply cannot be more than 500 characters']
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [150, 'Title cannot be more than 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  tags: {
      type: [String], // Array of tags
      default: []
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema],
  // Could add comments as a sub-document array later
  // comments: [CommentSchema] 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better performance
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
