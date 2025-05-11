const express = require('express');
const { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount
} = require('../controllers/notificationController');
const { requireAuth } = require('@clerk/express');

const router = express.Router();

// All routes require authentication
router.use(requireAuth());

// Get all notifications for the user
router.get('/', getNotifications);

// Get unread notification count
router.get('/count', getUnreadNotificationCount);

// Mark a notification as read
router.put('/:id/read', markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', markAllNotificationsAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

module.exports = router;
