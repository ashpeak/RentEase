const express = require('express');
const { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { requireAuth } = require('@clerk/express');

const router = express.Router();

// Create a new order
router.post('/', requireAuth(), createOrder);

// Get all orders for the authenticated user
router.get('/', requireAuth(), getUserOrders);

// Get a specific order by ID
router.get('/:orderId', requireAuth(), getOrderById);

// Update order status
router.patch('/:orderId/status', requireAuth(), updateOrderStatus);

module.exports = router;
