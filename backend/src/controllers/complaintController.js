const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

const allowedTransitions = {
  Pending: ["In Progress"],
  "In Progress": ["Resolved", "Rejected"],
  Resolved: [],
  Rejected: [],
};

const createComplaint = async (req, res) => {
  try {
    const { title, description, department, priority, lat, lng } = req.body;

    if (!title || !description || !department || !priority) {
      return res.status(400).json({ message: "All complaint fields are required" });
    }

    const location =
      typeof lat !== "undefined" && typeof lng !== "undefined" && lat !== "" && lng !== ""
        ? { lat: Number(lat), lng: Number(lng) }
        : { lat: null, lng: null };

    const complaint = await Complaint.create({
      title,
      description,
      department,
      priority,
      evidence: req.file ? req.file.path : "",
      createdBy: req.user._id,
      location,
    });

    return res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create complaint", error: error.message });
  }
};

const trackComplaintById = async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid complaint ID format" });
    }

    const complaint = await Complaint.findById(id).select(
      "title status priority department createdAt rating resolvedAt location"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json({ complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaint", error: error.message });
  }
};

const getComplaintPublicById = async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid complaint ID format" });
    }

    const complaint = await Complaint.findById(id).select(
      "title status priority department createdAt rating"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json({ complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaint", error: error.message });
  }
};

const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ complaints });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const { search = "", status, priority, department } = req.query;

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (department) filter.department = department;

    const complaints = await Complaint.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ complaints });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch all complaints", error: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const allowedNextStates = allowedTransitions[complaint.status] || [];
    if (!allowedNextStates.includes(status)) {
      return res.status(400).json({
        message: `Invalid transition from ${complaint.status} to ${status}. Allowed: ${allowedNextStates.join(", ") || "none"}`,
      });
    }

    complaint.status = status;

    if (status === "Resolved" && !complaint.resolvedAt) {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();
    return res.status(200).json({ message: "Status updated successfully", complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

const rateComplaint = async (req, res) => {
  try {
    const { rating } = req.body;

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (String(complaint.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only rate your own complaint" });
    }

    if (complaint.status !== "Resolved") {
      return res.status(400).json({ message: "You can rate only after the complaint is Resolved" });
    }

    if (complaint.rating !== null && typeof complaint.rating !== "undefined") {
      return res.status(400).json({ message: "Rating already submitted for this complaint" });
    }

    complaint.rating = numericRating;
    if (!complaint.resolvedAt) {
      complaint.resolvedAt = new Date();
    }
    await complaint.save();

    return res.status(200).json({ message: "Thank you for rating", complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to rate complaint", error: error.message });
  }
};

const assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    if (!assignedTo) {
      return res.status(400).json({ message: "assignedTo (admin id) is required" });
    }

    const adminUser = await User.findById(assignedTo);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(400).json({ message: "Assigned user must be an admin" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json({ message: "Complaint assigned successfully", complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to assign complaint", error: error.message });
  }
};

const getPublicStats = async (_req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
    const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });

    const departmentWise = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, department: "$_id", count: 1 } },
    ]);

    return res.status(200).json({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      departmentWise,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

const getAdmins = async (_req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id name email");
    return res.status(200).json({ admins });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admins", error: error.message });
  }
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
  rateComplaint,
  assignComplaint,
  getPublicStats,
  getAdmins,
  trackComplaintById,
  getComplaintPublicById,
};
