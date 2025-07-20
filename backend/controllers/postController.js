const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper function to create notifications
const createNotification = async (recipientId, senderId, type, content, postId = null, commentId = null) => {
  try {
    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
      post: postId,
      comment: commentId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// @desc    Get all posts with enhanced social data
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Populate user info, sort by newest, include social data
  const posts = await Post.find({})
    .populate('user', 'name avatar bio')
    .populate('likes', 'name avatar')
    .populate('bookmarks', 'name avatar')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments({});

  res.status(200).json({ 
    success: true, 
    count: posts.length, 
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: posts 
  });
});

// @desc    Get single post with full social data
// @route   GET /api/posts/:id
// @access  Public
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'name avatar bio')
    .populate('likes', 'name avatar')
    .populate('bookmarks', 'name avatar')
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name avatar'
        },
        {
          path: 'likes',
          select: 'name avatar'
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name avatar'
          }
        }
      ]
    });

  if (!post) {
    res.status(404);
    throw new Error(`Post not found with id of ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: post });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Requires Login)
const createPost = asyncHandler(async (req, res) => {
  if (!req.user) {
      res.status(401);
      throw new Error('User not authorized');
  }
  
  req.body.user = req.user.id;
  
  const post = await Post.create(req.body);
  
  // Populate user info for the response
  const populatedPost = await Post.findById(post._id)
    .populate('user', 'name avatar bio')
    .populate('likes', 'name avatar')
    .populate('bookmarks', 'name avatar');

  res.status(201).json({ success: true, data: populatedPost });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Requires Ownership or Admin)
const updatePost = asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User not authorized');
    }

  let post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error(`Post not found with id of ${req.params.id}`);
  }

  // Authorization check: Ensure user owns the post or is admin
  if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      res.status(401);
      throw new Error('User not authorized to update this post');
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('user', 'name avatar bio');

  res.status(200).json({ success: true, data: post });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Requires Ownership or Admin)
const deletePost = asyncHandler(async (req, res) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User not authorized');
    }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error(`Post not found with id of ${req.params.id}`);
  }

  // Authorization check: Ensure user owns the post or is admin
   if (post.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      res.status(401);
      throw new Error('User not authorized to delete this post');
  }

  await post.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private (Requires Login)
const likePost = asyncHandler(async (req, res) => {
     if (!req.user) {
      res.status(401);
      throw new Error('User not authorized');
    }

  const post = await Post.findById(req.params.id);
   if (!post) {
    res.status(404);
    throw new Error(`Post not found with id of ${req.params.id}`);
  }

  const isLiked = post.likes.includes(req.user.id);
  
  if (isLiked) {
    // Unlike
    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
  } else {
    // Like
    post.likes.push(req.user.id);
    
    // Create notification if not liking own post
    if (post.user.toString() !== req.user.id) {
      await createNotification(
        post.user,
        req.user.id,
        'post_like',
        `${req.user.name} liked your post "${post.title}"`,
        post._id
      );
    }
  }
  
  await post.save();
  
  const updatedPost = await Post.findById(post._id)
    .populate('user', 'name avatar bio')
    .populate('likes', 'name avatar');
  
  res.status(200).json({ 
    success: true, 
    data: { 
      likes: updatedPost.likes,
      isLiked: !isLiked,
      likeCount: updatedPost.likes.length
    } 
  });
});

// @desc    Bookmark/Unbookmark a post
// @route   PUT /api/posts/:id/bookmark
// @access  Private (Requires Login)
const bookmarkPost = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error(`Post not found with id of ${req.params.id}`);
  }

  const isBookmarked = post.bookmarks.includes(req.user.id);
  
  if (isBookmarked) {
    // Remove bookmark
    post.bookmarks = post.bookmarks.filter(id => id.toString() !== req.user.id);
  } else {
    // Add bookmark
    post.bookmarks.push(req.user.id);
  }
  
  await post.save();
  
  const updatedPost = await Post.findById(post._id)
    .populate('user', 'name avatar bio')
    .populate('bookmarks', 'name avatar');
  
  res.status(200).json({ 
    success: true, 
    data: { 
      bookmarks: updatedPost.bookmarks,
      isBookmarked: !isBookmarked,
      bookmarkCount: updatedPost.bookmarks.length
    } 
  });
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private (Requires Login)
const addComment = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error(`Post not found with id of ${req.params.id}`);
  }

  const newComment = {
    user: req.user.id,
    content: content.trim(),
    likes: [],
    replies: [],
    createdAt: new Date()
  };

  post.comments.push(newComment);
  await post.save();

  // Populate the new comment with user info
  const populatedPost = await Post.findById(post._id)
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

  // Create notification if not commenting on own post
  if (post.user.toString() !== req.user.id) {
    await createNotification(
      post.user,
      req.user.id,
      'post_comment',
      `${req.user.name} commented on your post "${post.title}"`,
      post._id,
      addedComment._id
    );
  }

  res.status(201).json({ 
    success: true, 
    data: addedComment 
  });
});

// @desc    Like/Unlike a comment
// @route   PUT /api/posts/:postId/comments/:commentId/like
// @access  Private (Requires Login)
const likeComment = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error(`Post not found with id of ${req.params.postId}`);
  }

  const comment = post.comments.id(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error(`Comment not found with id of ${req.params.commentId}`);
  }

  const isLiked = comment.likes.includes(req.user.id);
  
  if (isLiked) {
    // Unlike
    comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
  } else {
    // Like
    comment.likes.push(req.user.id);
    
    // Create notification if not liking own comment
    if (comment.user.toString() !== req.user.id) {
      await createNotification(
        comment.user,
        req.user.id,
        'comment_like',
        `${req.user.name} liked your comment`,
        post._id,
        comment._id
      );
    }
  }
  
  await post.save();
  
  res.status(200).json({ 
    success: true, 
    data: { 
      likes: comment.likes,
      isLiked: !isLiked,
      likeCount: comment.likes.length
    } 
  });
});

// @desc    Add reply to comment
// @route   POST /api/posts/:postId/comments/:commentId/replies
// @access  Private (Requires Login)
const addReply = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    res.status(400);
    throw new Error('Reply content is required');
  }

  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error(`Post not found with id of ${req.params.postId}`);
  }

  const comment = post.comments.id(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error(`Comment not found with id of ${req.params.commentId}`);
  }

  const newReply = {
    user: req.user.id,
    content: content.trim(),
    likes: [],
    createdAt: new Date()
  };

  comment.replies.push(newReply);
  await post.save();

  // Create notification for comment author
  if (comment.user.toString() !== req.user.id) {
    await createNotification(
      comment.user,
      req.user.id,
      'comment_reply',
      `${req.user.name} replied to your comment`,
      post._id,
      comment._id
    );
  }

  res.status(201).json({ 
    success: true, 
    data: newReply 
  });
});

// @desc    Get user's bookmarked posts
// @route   GET /api/posts/bookmarks
// @access  Private (Requires Login)
const getBookmarkedPosts = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const user = await User.findById(req.user.id).populate('bookmarkedPosts');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const bookmarkedPosts = await Post.find({
    _id: { $in: user.bookmarkedPosts }
  })
  .populate('user', 'name avatar bio')
  .populate('likes', 'name avatar')
  .populate('bookmarks', 'name avatar')
  .populate({
    path: 'comments',
    populate: {
      path: 'user',
      select: 'name avatar'
    }
  })
  .sort({ createdAt: -1 });

  res.status(200).json({ 
    success: true, 
    count: bookmarkedPosts.length, 
    data: bookmarkedPosts 
  });
});

module.exports = {
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
};
