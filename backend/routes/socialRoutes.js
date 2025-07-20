const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddlewareNew');
const {
  followUser,
  getFollowers,
  getFollowing,
  getUserFeed,
  getUserProfile,
  searchUsers
} = require('../controllers/socialController');

// Public routes
router.get('/search', searchUsers);
router.get('/profile/:userId', getUserProfile);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

// Protected routes
router.use(protect);
router.put('/follow/:userId', followUser);
router.get('/feed', getUserFeed);

module.exports = router; 