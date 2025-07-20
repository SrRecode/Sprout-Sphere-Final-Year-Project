/**
 * Error Handler Middleware
 * Provides consistent error responses for the API
 */

// Custom error handler
const errorHandler = (err, req, res, next) => {
  // Log error for server-side debugging
  console.error(`ERROR: ${err.message}`.red);
  console.error(err.stack);

  // Determine status code (default to 500 if not specified)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Not found handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound }; 