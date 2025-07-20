const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({
    recipient: req.user.id,
    isDeleted: false
  })
  .populate('sender', 'name avatar')
  .populate('post', 'title')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  const total = await Notification.countDocuments({
    recipient: req.user.id,
    isDeleted: false
  });

  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false,
    isDeleted: false
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    unreadCount,
    page,
    totalPages: Math.ceil(total / limit),
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user.id
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await Notification.updateMany(
    {
      recipient: req.user.id,
      isRead: false,
      isDeleted: false
    },
    {
      isRead: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user.id
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isDeleted = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification deleted'
  });
});

// @desc    Get notification count
// @route   GET /api/notifications/count
// @access  Private
const getNotificationCount = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false,
    isDeleted: false
  });

  res.status(200).json({
    success: true,
    unreadCount
  });
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
const updateNotificationPreferences = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { notificationPreferences } = req.body;
  
  if (notificationPreferences) {
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...notificationPreferences
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.notificationPreferences
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount,
  updateNotificationPreferences
}; 