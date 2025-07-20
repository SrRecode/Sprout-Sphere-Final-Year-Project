const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  userQuery: {
    type: String,
    required: true
  },
  recommendedPlants: {
    type: [mongoose.Schema.Types.Mixed] // Store basic plant info or references
  },
  reasoning: {
      type: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User' // Link to the user who requested it (optional)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
