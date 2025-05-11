const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Get payment data for the dashboard
 * @route GET /api/dashboard/payments
 * @access Private
 */
const getPaymentData = async (req, res) => {
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
    
    // Earnings - Calculate total earnings from products the user has rented out
    const ordersAsOwner = await Order.find({ 
      owner: user._id,
      paymentStatus: 'paid'
    }).populate('product');
    
    const totalEarnings = ordersAsOwner.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Total Spent - Calculate total spent on rentals the user has made
    const ordersAsRenter = await Order.find({ 
      renter: user._id,
      paymentStatus: 'paid'
    }).populate('product');
    
    const totalSpent = ordersAsRenter.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate pending payouts - assume 10% of earnings are pending for simplicity
    // In a real system, you'd track actual pending transfers
    const pendingPayouts = ordersAsOwner
      .filter(order => order.status === 'active')
      .reduce((sum, order) => sum + order.totalAmount, 0) * 0.1;
      
    // Calculate available balance - this would come from a payment service in a real app
    // For now, assume it's total earnings minus pending payouts
    const availableBalance = totalEarnings - pendingPayouts;
    
    // Get recent transactions
    const allOrders = [
      ...ordersAsOwner.map(order => ({
        id: order.orderNumber,
        type: 'income',
        amount: order.totalAmount,
        status: order.paymentStatus === 'paid' ? 'completed' : 'pending',
        description: `Rental payment for ${order.product.name}`,
        date: order.createdAt.toISOString().split('T')[0],
        from: {
          name: 'Customer', // In a real implementation, you'd get the renter's name
          initials: 'CU'
        },
        product: order.product.name
      })),
      ...ordersAsRenter.map(order => ({
        id: order.orderNumber,
        type: 'expense',
        amount: order.totalAmount,
        status: order.paymentStatus === 'paid' ? 'completed' : 'pending',
        description: `Rental fee for ${order.product.name}`,
        date: order.createdAt.toISOString().split('T')[0],
        to: {
          name: 'Owner', // In a real implementation, you'd get the owner's name
          initials: 'OW'
        },
        product: order.product.name
      }))
    ];
    
    // Sort by date (newest first)
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Return the payment data
    res.status(200).json({
      balance: availableBalance,
      pendingPayouts: pendingPayouts,
      totalEarnings: totalEarnings,
      totalSpent: totalSpent,
      transactions: allOrders.slice(0, 10) // Limit to 10 most recent transactions
    });
  } catch (error) {
    console.error('Error fetching payment data:', error);
    res.status(500).json({ message: 'Server error while fetching payment data' });
  }
};

module.exports = {
  getPaymentData
};
