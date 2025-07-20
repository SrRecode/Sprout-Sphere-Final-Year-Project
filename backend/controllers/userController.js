const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user preferences
// @route   GET /api/user/preferences
// @access  Private
exports.getPreferences = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user.preferences || {});
});

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
exports.updatePreferences = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
    
    res.json(user.preferences);
});

// @desc    Get user care history
// @route   GET /api/user/care-history
// @access  Private
exports.getCareHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user.careHistory || []);
});

// @desc    Add care history entry
// @route   POST /api/user/care-history
// @access  Private
exports.addCareHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    if (!user.careHistory) {
        user.careHistory = [];
    }
    
    user.careHistory.push({
        ...req.body,
        date: new Date()
    });
    
    await user.save();
    res.json(user.careHistory);
});

// @desc    Get weather-based recommendations
// @route   GET /api/user/weather-recommendations
// @access  Private
exports.getWeatherRecommendations = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    // TODO: Implement weather API integration
    // For now, return mock data
    res.json({
        recommendations: [
            {
                type: 'watering',
                message: 'Based on current weather, your plants may need extra water today.',
                severity: 'moderate'
            }
        ]
    });
}); 