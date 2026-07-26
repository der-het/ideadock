// backend/src/controllers/requestController.js
const JoinRequest = require("../models/JoinRequest");
const Startup = require("../models/Startup");

// @desc    Submit a join request for a startup
// @route   POST /api/requests
// @access  Public
const createJoinRequest = async (req, res) => {
  try {
    const { startupId, userId, applicantId, roleRequested, message } = req.body;
    const finalUserId = userId || applicantId;

    if (!startupId || !finalUserId) {
      return res.status(400).json({
        success: false,
        message: "Please provide startupId and userId",
      });
    }

    // 1. Check if startup exists
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup not found",
      });
    }

    // 2. Prevent user from applying to their own startup
    if (startup.user && startup.user.toString() === finalUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot request to join your own startup",
      });
    }

    // 3. Check if user already requested
    const existingRequest = await JoinRequest.findOne({
      startup: startupId,
      user: finalUserId,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a join request for this startup",
      });
    }

    // 4. Create request matching JoinRequest.js model schema
    const joinRequest = await JoinRequest.create({
      startup: startupId,
      user: finalUserId,
      roleRequested: roleRequested || "General Role",
      message: message || "",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Join request sent successfully",
      joinRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all join requests (Admin / Owner view)
// @route   GET /api/requests
// @access  Public
const getAllRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find()
      .populate("startup", "startupName whatsappNumber seatsNeeded")
      .populate("user", "name email skills bio")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get requests by specific user ID (Applicant check)
// @route   GET /api/requests/user/:userId
// @access  Public
const getUserRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({ user: req.params.userId })
      .populate({
        path: "startup",
        select:
          "startupName description seatsNeeded requiredSkills whatsappNumber status",
      })
      .sort({ createdAt: -1 });

    // Clean data response: if approved, expose the WhatsApp link
    const sanitizedRequests = requests.map((reqItem) => {
      const reqObj = reqItem.toObject();
      if (reqObj.status !== "approved" && reqObj.startup) {
        // Hide WhatsApp number if not approved yet
        delete reqObj.startup.whatsappNumber;
      }
      return reqObj;
    });

    res.status(200).json({
      success: true,
      count: sanitizedRequests.length,
      requests: sanitizedRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update request status (Approve / Reject)
// @route   PUT /api/requests/:id/status
// @access  Public
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const joinRequest = await JoinRequest.findById(req.params.id).populate(
      "startup",
    );

    if (!joinRequest) {
      return res.status(404).json({
        success: false,
        message: "Join request not found",
      });
    }

    joinRequest.status = status;
    await joinRequest.save();

    const responseData = {
      success: true,
      message: `Request status updated to ${status}`,
      request: joinRequest,
    };

    if (status === "approved" && joinRequest.startup) {
      responseData.whatsappNumber = joinRequest.startup.whatsappNumber;
      responseData.whatsappLink = `https://wa.me/${joinRequest.startup.whatsappNumber.replace(/[^0-9]/g, "")}`;
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createJoinRequest,
  getAllRequests,
  getUserRequests,
  updateRequestStatus,
};
