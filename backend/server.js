// ============================================================
// server.js - Main entry point for the Express backend
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ---- Middleware ----
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse incoming JSON request bodies

// ---- Routes ----
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// Root endpoint to verify server is running
app.get("/", (req, res) => {
  res.json({ message: "Complaint Management System API is running!" });
});

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
