// ============================================================
// middleware/auth.js - JWT Authentication & Authorization Middleware
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ---- Middleware: Verify JWT Token ----
// Protects routes by requiring a valid token in the Authorization header
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request object (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ---- Middleware: Admin Only ----
// Restricts access to admin users only (used after protect middleware)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, allow access
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { protect, adminOnly };
