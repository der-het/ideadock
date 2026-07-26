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
} = require("../controllers/authController");

// Ensure upload directory exists to prevent Multer 500 crashes
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage for avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Register endpoint
router.post("/register", registerUser);

// Login endpoint
router.post("/login", loginUser);

// Profile Update endpoint (Protected + Avatar File Upload)
router.put("/profile", upload.single("avatar"), updateProfile);

module.exports = router;
