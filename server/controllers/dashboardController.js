const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const mongoose = require('mongoose');

const getDashboardStats = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const clerkId = req.auth.userId;
    
    // Find user in database
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get total earnings (simplified)
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Find orders where user is the owner
    const orders = await Order.find({ 
      owner: user._id,
    });
    
    // Calculate total earnings
    const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate earnings from previous month
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= oneMonthAgo && orderDate <= currentDate;
    });
    
    const lastMonthEarnings = lastMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get previous month for comparison (simple calculation)
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    const twoMonthsAgoOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= twoMonthsAgo && orderDate <= oneMonthAgo;
    });
    
    const twoMonthsAgoEarnings = twoMonthsAgoOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate percentage change
    let percentageChange = 0;
    if (twoMonthsAgoEarnings > 0) {
      percentageChange = ((lastMonthEarnings - twoMonthsAgoEarnings) / twoMonthsAgoEarnings) * 100;
    } else if (lastMonthEarnings > 0) {
      percentageChange = 100; // If previous month was 0, but this month is positive, 100% increase
    }
    
    // Get active rentals
    const activeRentalsAsRenter = await Order.countDocuments({ 
      renter: user._id, 
      status: 'active' 
    });
    
    const activeRentalsAsOwner = await Order.countDocuments({ 
      owner: user._id, 
      status: 'active' 
    });
    
    // Get listed items stats
    const totalListedItems = await Product.countDocuments({ owner: user._id });
    const activeListedItems = await Product.countDocuments({ 
      owner: user._id,
      status: 'available'
    });
    
    // Get profile rating
    const reviews = await Review.find({ reviewer: user._id });
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = (totalRating / reviews.length).toFixed(1);
    }
    
    // Get recently rented items (as renter)
    const recentRentals = await Order.find({ renter: user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('product')
      .lean();
    
    // Get recently listed items
    const recentListings = await Product.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();
    
    // Get wishlist items
    const wishlist = await Wishlist.findOne({ user: user._id })
      .populate('products')
      .lean();
    
    const wishlistItems = wishlist ? wishlist.products.slice(0, 3) : [];
    
    // Return all stats
    res.status(200).json({
      earnings: {
        total: totalEarnings,
        lastMonth: lastMonthEarnings,
        percentageChange: percentageChange.toFixed(1)
      },
      activeRentals: {
        total: activeRentalsAsRenter + activeRentalsAsOwner,
        asRenter: activeRentalsAsRenter,
        asOwner: activeRentalsAsOwner
      },
      listedItems: {
        total: totalListedItems,
        active: activeListedItems,
        inactive: totalListedItems - activeListedItems
      },
      profileRating: {
        average: averageRating,
        totalReviews: reviews.length
      },
      recentRentals,
      recentListings,
      wishlistItems
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats
};
