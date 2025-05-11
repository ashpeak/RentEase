const Wishlist = require('../models/Wishlist');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const getWishlist = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wishlist = await Wishlist.findOne({ user: user._id }).populate({
      path: 'products',
      model: 'Product',
      select: '_id title images rate category featured createdAt', // Select fields you want to populate
    });

    if (!wishlist) {
      // If no wishlist exists for the user, return an empty wishlist
      return res.status(200).json({ products: [] });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const clerkId = req.auth.userId;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: user._id, products: [productId] });
    } else {
      // Check if product already exists by converting ObjectId to string for comparison
      if (wishlist.products.map(p => p.toString()).includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    // Populate the products for the response
    const populatedWishlist = await Wishlist.findOne({ user: user._id }).populate({
        path: 'products',
        model: 'Product',
        select: '_id title images rate category featured',
      });
    res.status(201).json(populatedWishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error while adding to wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const clerkId = req.auth.userId;
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wishlist = await Wishlist.findOne({ user: user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Convert ObjectId to string for comparison
    const productIndex = wishlist.products.map(p => p.toString()).indexOf(productId);

    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();
      const populatedWishlist = await Wishlist.findOne({ user: user._id }).populate({
        path: 'products',
        model: 'Product',
        select: '_id title images rate category featured',
      });
      return res.status(200).json(populatedWishlist);
    } else {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};