const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); // Import User model
const authMiddleware = require('../middleware/authMiddleware'); // Assuming middleware exists
const { protect, authorize } = require('../middleware/authMiddlewareNew');
const asyncHandler = require('express-async-handler');
const { uploadAvatar } = require('../middleware/uploadMiddleware'); // Import upload middleware
const { updateUserProfile, uploadUserAvatar } = require('../controllers/authController'); // Import controller functions
const crypto = require('crypto');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  asyncHandler(async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Create new user
      user = new User({
        name,
        email,
        password
      });

      // Hash password
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);

      // Save user to database
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // Generate JWT
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'mysecrettoken',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    } catch (err) {
      console.error('Register error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  })
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  asyncHandler(async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        return res.json({
          success: true,
          requireTwoFactor: true,
          userId: user.id
        });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // Generate JWT
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'mysecrettoken',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  })
);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', authMiddleware, asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}));

// @route   POST api/auth/google
// @desc    Login or register with Google
// @access  Public
router.post('/google', asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    // Here you would verify the token with Google's API
    // For now, we'll mock this verification
    
    // Mock decoded token (in production, use Google's API to verify)
    const decodedToken = {
      email: 'google_user@example.com', // This would come from Google's verification
      name: 'Google User',              // This would come from Google's verification
      sub: '123456789'                  // Google's unique user ID
    };

    // Check if user exists
    let user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      // Create new user
      user = new User({
        name: decodedToken.name,
        email: decodedToken.email,
        password: crypto.randomBytes(16).toString('hex'), // Random password
        googleId: decodedToken.sub
      });

      await user.save();
    } else {
      // Update Google ID if not already set
      if (!user.googleId) {
        user.googleId = decodedToken.sub;
        await user.save();
      }
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Generate JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}));

// @route   POST api/auth/facebook
// @desc    Login or register with Facebook
// @access  Public
router.post('/facebook', asyncHandler(async (req, res) => {
  const { accessToken, userID } = req.body;

  try {
    // Here you would verify the token with Facebook's API
    // For now, we'll mock this verification
    
    // Mock user data (in production, fetch from Facebook Graph API)
    const userData = {
      email: 'facebook_user@example.com', // This would come from Facebook's API
      name: 'Facebook User',              // This would come from Facebook's API
      id: userID                          // Facebook's unique user ID
    };

    // Check if user exists
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      // Create new user
      user = new User({
        name: userData.name,
        email: userData.email,
        password: crypto.randomBytes(16).toString('hex'), // Random password
        facebookId: userData.id
      });

      await user.save();
    } else {
      // Update Facebook ID if not already set
      if (!user.facebookId) {
        user.facebookId = userData.id;
        await user.save();
      }
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Generate JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Facebook auth error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}));

// @route   POST api/auth/reset-password
// @desc    Request password reset
// @access  Public
router.post('/reset-password', [
  check('email', 'Please include a valid email').isEmail()
], asyncHandler(async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return res.json({ success: true, message: 'If your email is registered, you will receive a password reset link' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();

    // In a real application, you would send an email with the reset link
    // For now, we'll just return the token in the response
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({ 
      success: true, 
      message: 'If your email is registered, you will receive a password reset link',
      // In production, don't include the token in the response
      // This is just for development/testing
      token: resetToken
    });
  } catch (err) {
    console.error('Password reset request error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}));

// @route   GET api/auth/reset-password/:token/verify
// @desc    Verify password reset token
// @access  Public
router.get('/reset-password/:token/verify', asyncHandler(async (req, res) => {
  try {
    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
    }

    res.json({ success: true, message: 'Token is valid' });
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}));

// @route   POST api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', [
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], asyncHandler(async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
    }

    // Set new password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(req.body.password, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    console.error('Password reset error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}));

// @route   POST api/auth/2fa/setup
// @desc    Setup two-factor authentication
// @access  Private
router.post('/2fa/setup', authMiddleware, asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // In a real application, you would generate a QR code and secret
    // For now, we'll just mock this
    const secret = crypto.randomBytes(10).toString('hex');
    
    // Save the secret to the user
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = true;
    
    await user.save();

    // In production, you would return a QR code image
    res.json({ 
      success: true, 
      secret,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SproutSphere:${user.email}?secret=${secret}&issuer=SproutSphere`
    });
  } catch (err) {
    console.error('2FA setup error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}));

// @route   POST api/auth/2fa/verify
// @desc    Verify two-factor authentication token
// @access  Public
router.post('/2fa/verify', [
  check('userId', 'User ID is required').not().isEmpty(),
  check('token', 'Token is required').isLength({ min: 6, max: 6 })
], asyncHandler(async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { userId, token } = req.body;

  try {
    const user = await User.findById(userId);
    
    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    // In a real application, you would verify the token against the user's secret
    // For now, we'll just mock this verification
    const isValid = token === '123456'; // Mock verification
    
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Generate JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('2FA verification error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}));

// @route   PUT api/auth/profile
// @desc    Update user profile (text fields)
// @access  Private
router.put('/profile', protect, updateUserProfile); // Use controller function

// @route   PUT api/auth/avatar
// @desc    Upload user avatar
// @access  Private
router.put('/avatar', protect, uploadAvatar, uploadUserAvatar);

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', protect, authorize('Admin'), asyncHandler(async (req, res) => {
  // Fetch all users, excluding their passwords
  const users = await User.find({}).select('-password');
  res.status(200).json({ success: true, count: users.length, data: users });
}));

module.exports = router;
