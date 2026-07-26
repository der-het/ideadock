// backend/src/controllers/startupController.js
const Startup = require("../models/Startup");

// @desc    Create a new startup post
// @route   POST /api/startups
// @access  Public
const createStartup = async (req, res) => {
  try {
    const {
      startupName,
      description,
      category,
      user,
      seatsNeeded,
      requiredSkills,
      whatsappNumber,
    } = req.body;

    // Validation
    if (!startupName || !description || !category || !user || !whatsappNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields (startupName, description, category, user, whatsappNumber)",
      });
    }

    const startup = await Startup.create({
      startupName,
      description,
      category,
      user,
      seatsNeeded: seatsNeeded || 1,
      requiredSkills: requiredSkills || [],
      whatsappNumber,
      status: "pending", // Default requires admin approval
    });

    res.status(201).json({
      success: true,
      message: "Startup submitted successfully. Awaiting admin approval.",
      startup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all approved startups (for users to browse)
// @route   GET /api/startups
// @access  Public
const getApprovedStartups = async (req, res) => {
  try {
    const startups = await Startup.find({ status: "approved" })
      .populate("category", "name")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: startups.length,
      startups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all startups (for Admin management)
// @route   GET /api/startups/admin/all
// @access  Public
const getAllStartupsAdmin = async (req, res) => {
  try {
    const startups = await Startup.find()
      .populate("category", "name")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: startups.length,
      startups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single startup details
// @route   GET /api/startups/:id
// @access  Public
const getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate("category", "name description")
      .populate("user", "name email bio skills");

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    res.status(200).json({
      success: true,
      startup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update startup status (Admin approval/rejection)
// @route   PUT /api/startups/:id/status
// @access  Public
const updateStartupStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Startup status updated to ${status}`,
      startup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a startup post
// @route   DELETE /api/startups/:id
// @access  Public
const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    await startup.deleteOne();

    res.status(200).json({
      success: true,
      message: "Startup deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createJoinRequest = async (req, res) => {
  try {
    const { startupId, roleRequested, message } = req.body;
    const userId = req.user._id; // Assumes your auth middleware attaches req.user

    // Check if request already exists
    const existing = await JoinRequest.findOne({
      startup: startupId,
      user: userId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already pitched to this startup.",
      });
    }

    const newRequest = await JoinRequest.create({
      startup: startupId,
      user: userId,
      roleRequested,
      message,
      status: "pending",
    });

    res.status(201).json({ success: true, joinRequest: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all join requests made by the logged-in user
// @route   GET /api/join-requests/my-requests
const getMyJoinRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({ user: req.user._id });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStartup,
  getApprovedStartups,
  getAllStartupsAdmin,
  getStartupById,
  updateStartupStatus,
  deleteStartup,
  createJoinRequest,
  getMyJoinRequests,
};
