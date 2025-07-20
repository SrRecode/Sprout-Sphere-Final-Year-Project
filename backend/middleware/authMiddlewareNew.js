const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Middleware to protect routes (check if logged in)
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  // Check for token in Authorization header (Bearer token)
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Get token from header
      token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token payload (excluding password)
      // We need the full user object here for role checks later
      req.user = await User.findById(decoded.user.id).select('-password');

      if (!req.user) {
          // Handle case where user specified in token doesn't exist anymore
          res.status(401);
          throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to next middleware/route handler
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to authorize based on roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // Protect middleware should have already run and attached req.user
    if (!req.user || !req.user.role) {
         res.status(401); // Or 403 Forbidden
         throw new Error('User role not found, authorization denied');
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403); // Forbidden - user logged in but doesn't have permission
      throw new Error(`User role '${req.user.role}' is not authorized to access this route`);
    }
    next(); // Role is authorized
  };
};

module.exports = { protect, authorize }; 