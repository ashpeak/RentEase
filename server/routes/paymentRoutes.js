const express = require('express');
const { getPaymentData } = require('../controllers/paymentController');
const { requireAuth } = require('@clerk/express');

const router = express.Router();

// Get payment data
router.get('/payments', requireAuth(), getPaymentData);

module.exports = router;
