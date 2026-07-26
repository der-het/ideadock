// backend/src/controllers/adminController.js
const User = require("../models/User");
const Startup = require("../models/Startup");
const Category = require("../models/Category");
const JoinRequest = require("../models/JoinRequest");

// @desc    Get dashboard summary/analytics stats
// @route   GET /api/admin/stats
// @access  Public (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const pendingStartups = await Startup.countDocuments({ status: "pending" });
    const approvedStartups = await Startup.countDocuments({
      status: "approved",
    });
    const totalCategories = await Category.countDocuments();
    const totalJoinRequests = await JoinRequest.countDocuments();
    const pendingJoinRequests = await JoinRequest.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStartups,
        pendingStartups,
        approvedStartups,
        totalCategories,
        totalJoinRequests,
        pendingJoinRequests,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Public (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a user (Role / Profile)
// @route   PUT /api/admin/users/:id
// @access  Public (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, role, bio, skills, title, location, avatar } =
      req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.bio = bio !== undefined ? bio : user.bio;
    user.title = title !== undefined ? title : user.title;
    user.location = location !== undefined ? location : user.location;
    user.avatar = avatar !== undefined ? avatar : user.avatar;

    if (skills !== undefined) {
      if (typeof skills === "string") {
        try {
          user.skills = JSON.parse(skills);
        } catch (e) {
          user.skills = skills.split(",").map((s) => s.trim());
        }
      } else if (Array.isArray(skills)) {
        user.skills = skills;
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        title: updatedUser.title,
        location: updatedUser.location,
        avatar: updatedUser.avatar,
        skills: updatedUser.skills,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Public (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all startups
// @route   GET /api/admin/startups
// @access  Public (Admin)
const getAdminStartups = async (req, res) => {
  try {
    const startups = await Startup.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, startups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a startup from Admin Panel
// @route   POST /api/admin/startups
// @access  Public (Admin)
const createAdminStartup = async (req, res) => {
  try {
    const {
      title,
      name,
      startupName,
      description,
      category: categoryInput,
      user: userInput,
      seatsNeeded,
      requiredSkills,
      whatsappNumber,
      status: statusInput,
    } = req.body;

    // 1. Resolve Category ObjectId (find or create category doc)
    const categoryName = categoryInput || "General";
    let categoryDoc = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, "i") },
    });

    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: categoryName });
    }

    // 2. Resolve User ObjectId
    let userId = userInput || req.user?._id;
    if (!userId) {
      const fallbackUser = await User.findOne();
      if (fallbackUser) {
        userId = fallbackUser._id;
      } else {
        const defaultUser = await User.create({
          name: "System Admin",
          email: "admin@startupconnect.com",
          password: "password123",
          role: "admin",
        });
        userId = defaultUser._id;
      }
    }

    // 3. Normalize Status to match schema enum ["pending", "approved", "rejected"]
    let formattedStatus = (statusInput || "approved").toLowerCase();
    if (formattedStatus === "active") formattedStatus = "approved";
    if (!["pending", "approved", "rejected"].includes(formattedStatus)) {
      formattedStatus = "approved";
    }

    // 4. Construct payload matching exact Mongoose schema requirements
    const startupData = {
      startupName: startupName || title || name || "Untitled Venture",
      description:
        description || "A novel venture concept added via the admin console.",
      category: categoryDoc._id,
      user: userId,
      seatsNeeded: Number(seatsNeeded) || 1,
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : typeof requiredSkills === "string"
          ? requiredSkills.split(",").map((s) => s.trim())
          : ["Full Stack", "General"],
      whatsappNumber: whatsappNumber || "+1234567890",
      status: formattedStatus,
    };

    const newStartup = await Startup.create(startupData);

    await newStartup.populate("category", "name");
    await newStartup.populate("user", "name email");

    return res.status(201).json({
      success: true,
      startup: newStartup,
    });
  } catch (error) {
    console.error("Error creating startup in adminController:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a startup
// @route   DELETE /api/admin/startups/:id
// @access  Public (Admin)
const deleteAdminStartup = async (req, res) => {
  try {
    await Startup.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Startup deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all join requests for admin dashboard
// @route   GET /api/admin/join-requests
// @access  Public (Admin)
const getAdminJoinRequests = async (req, res) => {
  try {
    const joinRequests = await JoinRequest.find()
      .populate("startup", "startupName title name")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, joinRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update join request status (approve/reject)
// @route   PUT /api/admin/join-requests/:id
// @access  Public (Admin)
const updateJoinRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedRequest = await JoinRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.status(200).json({ success: true, joinRequest: updatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAdminStartups,
  createAdminStartup,
  deleteAdminStartup,
  getAdminJoinRequests,
  updateJoinRequestStatus,
};
