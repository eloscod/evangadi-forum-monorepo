// Import required packages
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import controller functions for user endpoints
const {
  register,
  login,
  checkUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} = require("../controllers/userController");

// Import rate limiting middleware
const rateLimit = require("express-rate-limit");

// Rate limiting for login endpoint (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 5, // Max 5 requests
  message: {
    error: "Too Many Requests",
    message: "Too many login attempts, please try again later.",
  },
});

// Rate limiting for forgot-password endpoint (3 attempts per 15 minutes)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 3, // Max 3 requests
  message: {
    error: "Too Many Requests",
    message: "Too many password reset requests, please try again later.",
  },
});

// =======================
// ✅ PUBLIC ROUTES
// =======================

// Route to register a new user
router.post("/register", register);

// Route to log in a user and return a JWT token
router.post("/login", loginLimiter, login);

// Route to request a password reset link
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

// Route to reset the password using a token
router.post("/reset-password/:token", resetPassword);

// =======================
// 🔐 PROTECTED ROUTES
// =======================

// Route to check if a user is authenticated (requires token)
router.get("/checkUser", authMiddleware, checkUser);

// Route to get the current user's info (requires token)
router.get("/me", authMiddleware, getCurrentUser);

// Export the router
module.exports = router;
