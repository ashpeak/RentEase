const express = require('express');
const { getUserReviews, createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { requireAuth } = require('@clerk/express');

const router = express.Router();

// Get user reviews
router.get('/user', requireAuth(), getUserReviews);

// Get product reviews
router.get('/product/:productId', getProductReviews);

// Create a new review
router.post('/', requireAuth(), createReview);

// Delete a review
router.delete('/:reviewId', requireAuth(), deleteReview);

module.exports = router;
