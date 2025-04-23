import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

dotenv.config();

// Protect routes - verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database (exclude password)
      req.user = await User.findById(decoded.id).select("-password");
      
      // Check if user exists and is active
      if (!req.user || !req.user.isActive) {
        res.status(401);
        throw new Error("Not authorized, account is inactive or deleted");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Admin middleware
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
});

// Optional auth - doesn't require auth but will use it if provided
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Just log the error but don't throw
      console.error("Optional auth error:", error.message);
    }
  }
  
  next();
});

export { protect, admin, optionalAuth };