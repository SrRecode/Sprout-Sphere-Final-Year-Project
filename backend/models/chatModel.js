const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'bot', 'error'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  recommendations: [{
    name: String,
    scientificName: String,
    reason: String,
    careTip: String,
    image: String
  }]
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for guest users
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema); 