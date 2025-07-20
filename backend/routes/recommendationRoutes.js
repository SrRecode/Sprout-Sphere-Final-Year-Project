const express = require('express');
const router = express.Router();

// Import controller (to be created)
const {
    getRecommendation
} = require('../controllers/recommendationController');

// Import protection middleware
const { protect } = require('../middleware/authMiddlewareNew');

// --- Protected Route ---
// We'll add protection middleware later
router.route('/').post(protect, getRecommendation); // POST to send query, get recommendations

module.exports = router; 