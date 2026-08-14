// backend/src/routes/authRoutes.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

// ======================================================
// Upload Directory
// ======================================================

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ======================================================
// Multer Configuration
// ======================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});

// ======================================================
// Authentication Routes
// ======================================================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ======================================================
// Profile
// ======================================================

// Update profile + avatar
router.put("/profile", upload.single("avatar"), updateProfile);

// ======================================================
// Change Password
// ======================================================

router.put("/change-password", changePassword);

module.exports = router;
