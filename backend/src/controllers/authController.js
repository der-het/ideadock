// backend/src/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, bio, skills } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      bio: bio || "",
      skills: skills || [],
      title: "",
      location: "",
      avatar: "",
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          skills: user.skills,
          title: user.title,
          location: user.location,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Authenticate user & login
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // 2. Check for user email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Respond with full user info
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || "",
        skills: user.skills || [],
        title: user.title || "",
        location: user.location || "",
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Public
const updateProfile = async (req, res) => {
  try {
    const { userId, name, title, location, bio, skills } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to update profile",
      });
    }

    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (title !== undefined) updateFields.title = title;
    if (location !== undefined) updateFields.location = location;
    if (bio !== undefined) updateFields.bio = bio;

    if (skills !== undefined) {
      if (typeof skills === "string") {
        try {
          updateFields.skills = JSON.parse(skills);
        } catch (e) {
          updateFields.skills = skills.split(",").map((s) => s.trim());
        }
      } else if (Array.isArray(skills)) {
        updateFields.skills = skills;
      }
    }

    if (req.file) {
      updateFields.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating profile",
    });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Public
// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Public
const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // 1. Validate fields
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all password fields",
      });
    }

    // 2. Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // 3. Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // 5. Prevent same password
    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password",
      });
    }

    // 6. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 7. Save new password
    user.password = hashedPassword;

    await user.save();

    // 8. Success response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
};
