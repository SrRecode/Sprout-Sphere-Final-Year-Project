const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddlewareNew');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount,
  updateNotificationPreferences
} = require('../controllers/notificationController');

// All routes require authentication
router.use(protect);

// Get notifications
router.get('/', getNotifications);
router.get('/count', getNotificationCount);

// Mark notifications as read
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Update notification preferences
router.put('/preferences', updateNotificationPreferences);

module.exports = router; 