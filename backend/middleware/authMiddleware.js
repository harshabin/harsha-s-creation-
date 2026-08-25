const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes for logged-in users
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ success: false, message: 'Server auth configuration error' });
      }

      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found or session expired' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Admin role check
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required'
    });
  }
};

// Optional auth (doesn't throw if guest)
const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (error) {
      req.user = null;
    }
  }
  next();
};

module.exports = { protect, admin, optionalProtect };
