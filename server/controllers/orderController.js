const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Create a new order
const createOrder = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const clerkId = req.auth.userId;
    
    // Get the user making the order (renter)
    const renter = await User.findOne({ clerkId });
    if (!renter) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${uuidv4().slice(0, 4)}`;
    
    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ message: 'No items provided in the order' });
    }
    
    // Prepare order items with proper references
    const orderItems = await Promise.all(req.body.items.map(async (item) => {
      if (!item.product || !item.product._id) {
        throw new Error('Product ID is missing in order item');
      }
        // Fetch the product to get the correct owner reference
      const product = await Product.findById(item.product._id);
      if (!product) {
        throw new Error(`Product not found with ID: ${item.product._id}`);
      }
      
      return {
        orderNumber,
        renter: renter._id,
        product: item.product._id,
        owner: product.owner, // Get owner directly from the product in database
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        totalDays: item.days,
        rentalRate: item.product.rate,
        securityDeposit: item.securityDeposit,
        serviceFee: (item.price * 0.1), // 10% service fee
        totalAmount: item.price + (item.price * 0.1), // item price + service fee
        deliveryMethod: req.body.deliveryOption || 'pickup',
        paymentStatus: req.body.paymentStatus || 'pending',
        paymentMethod: req.body.paymentMethod || 'credit-card',
        paymentId: req.body.paymentId,
        status: 'confirmed',
      };
    }));    // Create the orders
    const orders = await Order.insertMany(orderItems);

    // Send notifications to product owners
    try {
      for (const order of orders) {
        const populatedOrder = await Order.findById(order._id)
          .populate('product')
          .populate('owner', 'clerkId firstName lastName');
      }
    } catch (notificationError) {
      // Log but don't fail the request if notifications have an issue
      console.error('Error sending notifications:', notificationError);
    }

    // Return success response
    res.status(201).json({
      message: 'Orders created successfully',
      orderNumber,
      orders
    });} catch (error) {
    console.error('Error creating order:', error);
    
    // Provide more specific error messages based on error type
    if (error.message && error.message.includes('Product not found')) {
      return res.status(404).json({ message: error.message });
    } else if (error.message && error.message.includes('Product ID is missing')) {
      return res.status(400).json({ message: error.message });
    } else if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error in order data', details: error.message });
    }
    
    res.status(500).json({ message: 'Server error while creating order' });
  }
};

// Get orders for the authenticated user
const getUserOrders = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get orders where user is either renter or owner
    const orders = await Order.find({
      $or: [
        { renter: user._id },
        { owner: user._id }
      ]
    })
    .populate('product')
    .populate('renter', 'name email profileImage')
    .populate('owner', 'name email profileImage')
    .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId)
      .populate('product')
      .populate('renter', 'name email profileImage')
      .populate('owner', 'name email profileImage');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify the user is either the renter or owner
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    
    if (!user || (order.renter._id.toString() !== user._id.toString() && 
                  order.owner._id.toString() !== user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const allowedStatuses = ['confirmed', 'active', 'completed', 'cancelled', 'disputed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify the user is either the renter or owner
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    
    if (!user || (order.renter.toString() !== user._id.toString() && 
                  order.owner.toString() !== user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Apply specific business rules for status changes
    if (status === 'cancelled' && ['active', 'completed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel an active or completed order' });
    }

    // Update the order
    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error while updating order' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};
