const express = require('express');
const { getUser } = require('../controllers/userController');
const { requireAuth } = require('@clerk/express');

const router = express.Router();

// Get cart items
router.get('/', requireAuth(), getUser);

module.exports = router;