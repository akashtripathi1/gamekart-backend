import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  // Handle express-validator errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array(),
    });
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  // Handle token expiration
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Handle MongoDB duplicate key errors
if (err.code === 11000) {
  const field = Object.keys(err.keyValue)[0];
  let message = `${field} already exists`;
  
  // Add more context for username conflicts
  if (field === 'username') {
    message = 'This email is already associated with an account. Please use a different email.';
  }
  
  return res.status(400).json({
    success: false,
    message
  });
}

  // Handle CastError (invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Default error handler
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;