// ============================================================
// controllers/complaintController.js - Complaint CRUD Logic
// ============================================================

const Complaint = require("../models/Complaint");

// ---- POST /api/complaints ----
// Submit a new complaint (logged-in user)
const submitComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate inputs
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Create complaint linked to the currently logged-in user
    const complaint = await Complaint.create({
      userId: req.user._id, // req.user is set by the protect middleware
      title,
      description,
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Submit complaint error:", error.message);
    res.status(500).json({ message: "Server error while submitting complaint" });
  }
};

// ---- GET /api/complaints ----
// Get complaints for the currently logged-in user only
const getUserComplaints = async (req, res) => {
  try {
    // Filter by status if query param is provided (e.g., ?status=Pending)
    const filter = { userId: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Find complaints belonging to this user, newest first
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (error) {
    console.error("Get user complaints error:", error.message);
    res.status(500).json({ message: "Server error while fetching complaints" });
  }
};

// ---- GET /api/complaints/all ----
// Get ALL complaints from all users (admin only)
const getAllComplaints = async (req, res) => {
  try {
    // Filter by status if query param is provided
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Populate userId with user email so admin can see who submitted
    const complaints = await Complaint.find(filter)
      .populate("userId", "email") // Only include email from User model
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (error) {
    console.error("Get all complaints error:", error.message);
    res.status(500).json({ message: "Server error while fetching all complaints" });
  }
};

// ---- PUT /api/complaints/:id ----
// Update complaint status (admin only)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status value
    const validStatuses = ["Pending", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the complaint and update its status
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error.message);
    res.status(500).json({ message: "Server error while updating complaint" });
  }
};

module.exports = {
  submitComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
};
