// ============================================================
// models/User.js - Mongoose schema for User
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // User's email - must be unique
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password (never store plain text)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // Role determines what the user can access
    role: {
      type: String,
      enum: ["user", "admin"], // Only these two values are allowed
      default: "user",        // New signups are regular users by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// ---- Pre-save Hook: Hash password before saving ----
// This runs automatically before every .save() call
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---- Instance Method: Compare entered password with hashed one ----
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
