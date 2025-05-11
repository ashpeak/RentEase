const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { requireAuth } = require('@clerk/express');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', requireAuth(), getDashboardStats);

module.exports = router;
