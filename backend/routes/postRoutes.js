const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddlewareNew');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  bookmarkPost,
  addComment,
  likeComment,
  addReply,
  getBookmarkedPosts
} = require('../controllers/postController');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Social interaction routes
router.put('/:id/like', protect, likePost);
router.put('/:id/bookmark', protect, bookmarkPost);
router.get('/bookmarks', protect, getBookmarkedPosts);

// Comment routes
router.post('/:id/comments', protect, addComment);
router.put('/:postId/comments/:commentId/like', protect, likeComment);
router.post('/:postId/comments/:commentId/replies', protect, addReply);

module.exports = router; 