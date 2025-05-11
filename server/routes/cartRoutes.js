const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { requireAuth } = require('@clerk/express');

const router = express.Router();

// Get cart items
router.get('/', requireAuth(), getCart);

// Add item to cart
router.post('/', requireAuth(), addToCart);

// Remove item from cart
router.delete('/:itemId', requireAuth(), removeFromCart);

// Clear cart
router.delete('/', requireAuth(), clearCart);

module.exports = router;
