
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const { sendNotification } = require('../services/webSocketService');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');

const getNotifications = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.auth.userId;
    
    // Find user in database
    const user = await mongoose.model("User").findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get notifications for the user, sorted by creation date (newest first)
    const notifications = await Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 most recent notifications
      .lean();
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.auth.userId;
    const notificationId = req.params.id;
    
    // Find user in database
    const user = await mongoose.model("User").findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find and update the notification
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: user._id },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or does not belong to user' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error while updating notification' });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.auth.userId;
    
    // Find user in database
    const user = await mongoose.model("User").findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update all unread notifications
    const result = await Notification.updateMany(
      { user: user._id, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({ 
      message: 'All notifications marked as read',
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error while updating notifications' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.auth.userId;
    const notificationId = req.params.id;
    
    // Find user in database
    const user = await mongoose.model("User").findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find and delete the notification
    const notification = await Notification.findOneAndDelete(
      { _id: notificationId, user: user._id }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or does not belong to user' });
    }
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error while deleting notification' });
  }
};

const createNotification = async (userId, type, title, message, options = {}) => {
  try {
    // Find user in database
    const user = await mongoose.model("User").findOne({ clerkId: userId });
    if (!user) {
      throw new Error('User not found');
    }
    
    const notification = new Notification({
      user: user._id,
      type,
      title,
      message,
      relatedId: options.relatedId,
      relatedModel: options.relatedModel,
      sender: options.sender
    });
    
    const savedNotification = await notification.save();
    
    // Format notification for client
    const notificationForClient = {
      id: savedNotification._id.toString(),
      type,
      title,
      message,
      createdAt: savedNotification.createdAt.toISOString(),
      read: false,
      actionUrl: options.actionUrl,
      relatedId: options.relatedId ? options.relatedId.toString() : undefined,
      sender: options.sender
    };
    
    // Send real-time notification to connected client
    sendNotification(userId, notificationForClient);
    
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.auth.userId;
    
    // Find user in database
    const user = await mongoose.model("User").findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Count unread notifications for the user
    const notificationCount = await Notification.countDocuments({ 
      user: user._id,
      isRead: false
    });
    
    // Count items in cart
    const cart = await Cart.findOne({ user: user._id });
    const cartCount = cart ? cart.items.length : 0;
    
    // Count items in wishlist
    const wishlist = await Wishlist.findOne({ user: user._id });
    const wishlistCount = wishlist ? wishlist.products.length : 0;
    
    // Combine all counts in the response
    res.status(200).json({ 
      notificationCount,
      cartCount,
      wishlistCount
    });
  } catch (error) {
    console.error('Error counting user items:', error);
    res.status(500).json({ message: 'Server error while counting items' });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification,
  getUnreadNotificationCount
};
