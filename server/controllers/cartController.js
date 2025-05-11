const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get cart items for a user
const getCart = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: '_id title images rate category isAvailable securityDeposit description'
      })
      .populate({
        path: 'items.product.owner',
        model: 'User',
        select: 'name profileImage'
      });

    if (!cart) {
      // If no cart exists for the user, return an empty cart
      return res.status(200).json({ items: [], total: 0 });
    }

    // Calculate the total price
    const total = cart.items.reduce((sum, item) => sum + item.price + item.securityDeposit, 0);

    res.status(200).json({ 
      items: cart.items,
      total,
      updatedAt: cart.updatedAt
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const clerkId = req.auth.userId;
    const { productId, startDate, endDate, days, message } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    if (!startDate || !endDate || !days) {
      return res.status(400).json({ message: 'Start date, end date, and rental days are required' });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.isAvailable === false) {
      return res.status(400).json({ message: 'Product is not available for rent' });
    }

    let cart = await Cart.findOne({ user: user._id });

    // Calculate the price based on the product's rate and the number of days
    const price = product.rate * days;

    const newCartItem = {
      product: productId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days,
      message: message || '',
      price,
      securityDeposit: product.securityDeposit || 0
    };

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user: user._id,
        items: [newCartItem]
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Replace the existing item with the new one
        cart.items[existingItemIndex] = newCartItem;
      } else {
        // Add the new item to the cart
        cart.items.push(newCartItem);
      }
    }

    await cart.save();

    // Populate the items for the response
    const populatedCart = await Cart.findOne({ user: user._id })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: '_id title images rate category isAvailable securityDeposit owner'
      })
      .populate({
        path: 'items.product.owner',
        model: 'User',
        select: 'name profileImage'
      });

    // Calculate the total price
    const total = populatedCart.items.reduce((sum, item) => sum + item.price + item.securityDeposit, 0);

    res.status(201).json({ 
      items: populatedCart.items,
      total,
      updatedAt: populatedCart.updatedAt,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const clerkId = req.auth.userId;
    const { itemId } = req.params;

    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid Item ID' });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);
    await cart.save();

    // Populate the items for the response
    const populatedCart = await Cart.findOne({ user: user._id })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: '_id title images rate category isAvailable securityDeposit owner'
      })
      .populate({
        path: 'items.product.owner',
        model: 'User',
        select: 'name profileImage'
      });

    // Calculate the total price
    const total = populatedCart.items.reduce((sum, item) => sum + item.price + item.securityDeposit, 0);

    res.status(200).json({ 
      items: populatedCart.items,
      total,
      updatedAt: populatedCart.updatedAt,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
};

// Clear the cart
const clearCart = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear all items from the cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ 
      items: [],
      total: 0,
      updatedAt: cart.updatedAt,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};