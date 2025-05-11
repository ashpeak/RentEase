const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getUserProducts,
  toggleProductAvailability, // Import the new controller function
  createProductReview,
  getProductReviews,
  getProductsByCategory, // Import the createProductReview controller
} = require('../controllers/productController');
const { requireAuth } = require('@clerk/express');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes - require authentication
router.post('/', requireAuth(), createProduct);
router.post('/:productId/reviews', requireAuth(), createProductReview);
router.put('/:id', requireAuth(), updateProduct);
router.put('/:id/toggle-availability', requireAuth(), toggleProductAvailability);
router.delete('/:id', requireAuth(), deleteProduct);
router.get('/user/my-listings', requireAuth(), getUserProducts);
router.get('/:id/reviews', getProductReviews);
router.get('/category/:category', getProductsByCategory);

module.exports = router;
