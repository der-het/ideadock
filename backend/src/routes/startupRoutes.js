// backend/src/routes/startupRoutes.js
const express = require("express");
const router = express.Router();
const {
  createStartup,
  getApprovedStartups,
  getAllStartupsAdmin,
  getStartupById,
  updateStartupStatus,
  deleteStartup,
} = require("../controllers/startupController");

// Public route to get approved startups & submit new startups
router.route("/").get(getApprovedStartups).post(createStartup);

// Admin route to fetch all startups regardless of status
router.get("/admin/all", getAllStartupsAdmin);

// Fetch single startup & delete
router.route("/:id").get(getStartupById).delete(deleteStartup);

// Update status (Approve / Reject)
router.put("/:id/status", updateStartupStatus);

module.exports = router;
