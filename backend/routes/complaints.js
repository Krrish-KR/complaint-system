// ============================================================
// routes/complaints.js - Complaint Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  submitComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

// POST /api/complaints - Submit a new complaint (any logged-in user)
router.post("/", protect, submitComplaint);

// GET /api/complaints - Get complaints for the logged-in user
router.get("/", protect, getUserComplaints);

// GET /api/complaints/all - Get ALL complaints (admin only)
// NOTE: This route must be defined BEFORE /:id to avoid conflicts
router.get("/all", protect, adminOnly, getAllComplaints);

// PUT /api/complaints/:id - Update status of a complaint (admin only)
router.put("/:id", protect, adminOnly, updateComplaintStatus);

module.exports = router;
