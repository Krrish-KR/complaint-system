// ============================================================
// controllers/authController.js - Signup & Login Logic
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ---- Helper: Generate JWT Token ----
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

// ---- POST /api/auth/signup ----
// Register a new user
const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user (password hashing happens in model pre-save hook)
    const user = await User.create({
      email,
      password,
      role: role || "user", // Default to "user" role
    });

    // Return user data with JWT token
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ---- POST /api/auth/login ----
// Login existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches (uses comparePassword method from model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user data with JWT token
    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { signup, login };
