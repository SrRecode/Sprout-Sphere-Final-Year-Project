const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const fs = require('fs'); // File system module
const path = require('path'); // Path module

// @desc    Update user profile (text fields)
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    // Note: Validation can be added here if needed
    const { name, location, phone, postalCode } = req.body;

    const user = await User.findById(req.user.id);

    if (user) {
        user.name = name || user.name;
        user.location = location || user.location;
        user.phone = phone || user.phone;
        user.postalCode = postalCode || user.postalCode;

        const updatedUser = await user.save();

        // Return updated user data (excluding password)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar, // Include avatar
            location: updatedUser.location,
            phone: updatedUser.phone,
            postalCode: updatedUser.postalCode,
            createdAt: updatedUser.createdAt
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Upload user avatar
// @route   PUT /api/auth/avatar
// @access  Private
const uploadUserAvatar = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        // Clean up uploaded file if user not found
        if (req.file) {
           try {
               fs.unlinkSync(req.file.path);
           } catch (unlinkErr) {
               console.error("Error removing uploaded file for non-existent user:", unlinkErr);
           }
        }
        throw new Error('User not found');
    }

    if (!req.file) {
        res.status(400);
        throw new Error('No image file uploaded');
    }

    // Check if user already has an avatar and delete the old one
    if (user.avatar && user.avatar !== '/uploads/avatars/default.png') { // Avoid deleting default
        const oldAvatarPath = path.join(__dirname, '..', user.avatar); // Construct path relative to this file
        try {
           if (fs.existsSync(oldAvatarPath)) {
              fs.unlinkSync(oldAvatarPath);
              console.log(`Deleted old avatar: ${oldAvatarPath}`);
           }
        } catch (err) {
           console.error(`Error deleting old avatar ${oldAvatarPath}:`, err);
           // Don't fail the request, just log the error
        }
    }


    // Construct the URL path for the avatar
    // Note: req.file.path contains the full system path, we need the relative URL path
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    user.avatar = avatarUrl;
    const updatedUser = await user.save();

     // Return updated user data (excluding password)
    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        location: updatedUser.location,
        phone: updatedUser.phone,
        postalCode: updatedUser.postalCode,
        createdAt: updatedUser.createdAt
    });
});


module.exports = {
    updateUserProfile,
    uploadUserAvatar
}; 