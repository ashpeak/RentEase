const Product = require('../models/Product');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const User = require('../models/User');

const createProduct = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized, please login' });
    }


    const userMongoId = await User.findOne({ clerkId: userId }).select('_id');
    if (!userMongoId) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    // Extract form data from request body
    const {
      title,
      category,
      description,
      brand,
      model,
      condition,
      rate,
      selectedPricingModel,
      minRentalPeriodValue,
      securityDeposit,
      rentalRules,
      pickupLocation,
      deliveryOptions,
      availableFrom,
      availableTo,
      mainPhoto,
      additionalPhotos,
    } = req.body;

    // Validate required fields
    if (!title || !description || !condition || !rate || !minRentalPeriodValue || !selectedPricingModel || !securityDeposit || !pickupLocation) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields including rate, period, and model' });
    }

    // Parse location data from the pickup location string
    // This is a simplified example - in a real app, you might use a geocoding service
    const [city, state] = pickupLocation.split(',').map(s => s.trim());

    // Create product document
    const newProduct = await Product.create({
      title,
      description,
      images: [mainPhoto, ...additionalPhotos],
      category: category,
      tags: [],
      condition,
      rate: parseFloat(rate),
      selectedPricingModel: selectedPricingModel,
      minRentalPeriodValue: parseInt(minRentalPeriodValue),
      securityDeposit: parseFloat(securityDeposit),
      location: {
        address: pickupLocation,
        city: city || 'Unknown',
        state: state || 'Unknown',
        zipCode: '201310',
        country: 'India',
      },
      availabilityCalendar: [
        {
          startDate: new Date(availableFrom),
          endDate: availableTo ? new Date(availableTo) : new Date('2099-12-31'),
        },
      ],
      userId: userId,
      owner: userMongoId._id,
      isAvailable: true,
      isApproved: false,
      specifications: {
        brand,
        model,
        rentalRules,
        deliveryOptions,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isAvailable: true,
    })
      .populate('owner', 'name profileImage')
      .populate('category', 'name')
      .select('-__v');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'name profileImage',
        },
      });

    const user = await User.findOne({ clerkId: product.userId }).select('name profileImage');

    if (user) {
      product = product.toObject(); // Convert Mongoose document to plain object
      product.owner = user; // Add owner information to the product object
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const productId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized, please login' });
    }

    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if the user is the owner of the product
    if (product.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // Update product
    product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const productId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized, please login' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if the user is the owner of the product
    if (product.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    const products = await Product.find({ userId })
      .populate('category', 'title')
      .select('-__v');

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const toggleProductAvailability = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const productId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized, please login' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if the user is the owner of the product
    if (product.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // Toggle availability
    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product availability ${product.isAvailable ? 'activated' : 'paused'} successfully`,
      data: product,
    });
  } catch (error) {
    console.error('Error toggling product availability:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { rating, comment, reviewType } = req.body;
    let reviewerId = req.auth?.userId;
    let productId = req.body.productId;

    productId = new mongoose.Types.ObjectId(productId);

    // Basic validation
    if (!rating || !comment || !reviewType) {
      return res.status(400).json({ message: "Missing required fields: rating, comment, reviewType." });
    }

    if (reviewType === "product" && !productId) {
      return res.status(400).json({ message: "Product ID is required for product reviews." });
    }

    if (reviewType === "renter" || reviewType === "owner") {
      return res.status(400).json({ message: "Reviewed user ID is required for renter/owner reviews." });
    }

    // TODO: Add logic to verify that the reviewer is authorized to review this product/user for this order
    // For example, check if the reviewer was part of the order (either as renter or owner of the product in the order)

    const reviewData = {
      reviewer: reviewerId,
      rating,
      comment,
      reviewType,
      product: productId
    };

    const review = new Review(reviewData);
    await review.save();

    res.status(201).json({ success: true, message: "Review submitted successfully.", review });

  } catch (error) {
    console.error("Error creating review:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already submitted a review for this item/user in this order." });
    }
    res.status(500).json({ message: error.message || "Failed to submit review." });
  }
};

const getProductReviews = async (req, res) => {
  try {
    let productId = req.params.id;
    productId = new mongoose.Types.ObjectId(productId);

    const reviews = await Review.find({ product: productId })
      .populate({
        path: 'reviewer',
        model: 'User',
        localField: 'reviewer',
        foreignField: 'clerkId',
        select: 'name profileImage'
      });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;   

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    const products = await Product.find({ category })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getUserProducts,
  toggleProductAvailability,
  createProductReview,
  getProductReviews,
  getProductsByCategory
};