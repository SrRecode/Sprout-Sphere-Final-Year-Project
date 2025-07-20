const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
    match: [/.+@.+\..+/, 'Please fill a valid email address'] // Fixed email regex
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['User', 'Moderator', 'Admin'], // Define possible roles
    default: 'User' // Default role for new users
  },
  status: { // Added status field based on UserManagementPage placeholder
    type: String,
    enum: ['Active', 'Suspended'],
    default: 'Active'
  },
  // Add other fields as needed
  avatar: {
      type: String,
      default: '' // Or a default avatar URL
  },
  location: {
      type: String,
      default: ''
  },
  phone: {
      type: String,
      default: ''
  },
  postalCode: {
      type: String,
      default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: ''
  },
  // Social features
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarkedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  // Notification preferences
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    inApp: {
      type: Boolean,
      default: true
    },
    // Specific notification types
    newFollowers: {
      type: Boolean,
      default: true
    },
    postLikes: {
      type: Boolean,
      default: true
    },
    postComments: {
      type: Boolean,
      default: true
    },
    mentions: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  careHistory: [{
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    },
    action: {
      type: String,
      required: true,
      enum: ['watering', 'fertilizing', 'pruning', 'repotting', 'other']
    },
    notes: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ followers: 1 });
UserSchema.index({ following: 1 });

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare entered password with hashed password in database
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 