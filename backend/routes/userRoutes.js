const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddlewareNew');

// Import controllers (to be created)
const {
    getPreferences,
    updatePreferences,
    getCareHistory,
    addCareHistory,
    getWeatherRecommendations
} = require('../controllers/userController');

// User Preferences Routes
router.route('/preferences')
    .get(protect, getPreferences)
    .put(protect, updatePreferences);

// Care History Routes
router.route('/care-history')
    .get(protect, getCareHistory)
    .post(protect, addCareHistory);

// Weather Recommendations Route
router.route('/weather-recommendations')
    .get(protect, getWeatherRecommendations);

module.exports = router; 