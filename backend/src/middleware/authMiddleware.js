// backend/src/middleware/authMiddleware.js
const User = require("../models/User");

// Middleware to verify user exists and is an Admin
const adminProtect = async (req, res, next) => {
  try {
    // Read userId passed via headers or query/body
    const userId =
      req.headers["x-user-id"] || req.body?.userId || req.query?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no user ID provided",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin privileges required",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authorization check failed",
      error: error.message,
    });
  }
};

module.exports = { adminProtect };
