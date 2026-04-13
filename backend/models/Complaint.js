// ============================================================
// models/Complaint.js - Mongoose schema for Complaint
// ============================================================

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    // Reference to the user who submitted this complaint
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },

    // Title of the complaint
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },

    // Detailed description of the complaint
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000,
    },

    // Current status of the complaint
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending", // All new complaints start as Pending
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
