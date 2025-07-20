const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Helper function to create notifications
const createNotification = async (recipientId, senderId, type, content) => {
  try {
    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      content
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// @desc    Follow/Unfollow a user
// @route   PUT /api/social/follow/:userId
// @access  Private
const followUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const targetUserId = req.params.userId;
  
  // Prevent self-following
  if (targetUserId === req.user.id) {
    res.status(400);
    throw new Error('You cannot follow yourself');
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  const currentUser = await User.findById(req.user.id);
  if (!currentUser) {
    res.status(404);
    throw new Error('Current user not found');
  }

  const isFollowing = currentUser.following.includes(targetUserId);
  
  if (isFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user.id);
  } else {
    // Follow
    currentUser.following.push(targetUserId);
    targetUser.followers.push(req.user.id);
    
    // Create notification
    await createNotification(
      targetUserId,
      req.user.id,
      'new_follower',
      `${currentUser.name} started following you`
    );
  }

  await currentUser.save();
  await targetUser.save();

  res.status(200).json({
    success: true,
    data: {
      isFollowing: !isFollowing,
      followingCount: currentUser.following.length,
      followersCount: targetUser.followers.length
    }
  });
});

// @desc    Get user's followers
// @route   GET /api/social/followers/:userId
// @access  Public
const getFollowers = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const user = await User.findById(userId)
    .populate({
      path: 'followers',
      select: 'name avatar bio',
      options: {
        skip,
        limit
      }
    });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const total = user.followers.length;

  res.status(200).json({
    success: true,
    count: user.followers.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: user.followers
  });
});

// @desc    Get user's following
// @route   GET /api/social/following/:userId
// @access  Public
const getFollowing = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const user = await User.findById(userId)
    .populate({
      path: 'following',
      select: 'name avatar bio',
      options: {
        skip,
        limit
      }
    });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const total = user.following.length;

  res.status(200).json({
    success: true,
    count: user.following.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: user.following
  });
});

// @desc    Get user's feed (posts from followed users)
// @route   GET /api/social/feed
// @access  Private
const getUserFeed = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const currentUser = await User.findById(req.user.id);
  if (!currentUser) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get posts from followed users and own posts
  const followedUserIds = [...currentUser.following, req.user.id];

  const posts = await Post.find({
    user: { $in: followedUserIds }
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
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  const total = await Post.countDocuments({
    user: { $in: followedUserIds }
  });

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: posts
  });
});

// @desc    Get user profile with social stats
// @route   GET /api/social/profile/:userId
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const currentUserId = req.user?.id;

  const user = await User.findById(userId)
    .select('name avatar bio location createdAt followers following');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get user's posts count
  const postsCount = await Post.countDocuments({ user: userId });

  // Check if current user is following this user
  let isFollowing = false;
  if (currentUserId && currentUserId !== userId) {
    const currentUser = await User.findById(currentUserId);
    isFollowing = currentUser.following.includes(userId);
  }

  // Get recent posts
  const recentPosts = await Post.find({ user: userId })
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
    .limit(5);

  const profile = {
    _id: user._id,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    location: user.location,
    createdAt: user.createdAt,
    stats: {
      posts: postsCount,
      followers: user.followers.length,
      following: user.following.length
    },
    isFollowing,
    recentPosts
  };

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Search users
// @route   GET /api/social/search
// @access  Public
const searchUsers = asyncHandler(async (req, res) => {
  const { q: query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  if (!query || query.trim().length === 0) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { bio: { $regex: query, $options: 'i' } }
    ]
  })
  .select('name avatar bio followers following')
  .skip(skip)
  .limit(limit);

  const total = await User.countDocuments({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { bio: { $regex: query, $options: 'i' } }
    ]
  });

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: users
  });
});

module.exports = {
  followUser,
  getFollowers,
  getFollowing,
  getUserFeed,
  getUserProfile,
  searchUsers
}; 