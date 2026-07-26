// backend/src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  // 1. Import startup controllers
  getAdminStartups,
  createAdminStartup,
  deleteAdminStartup,
  getAdminJoinRequests,
  updateJoinRequestStatus,
} = require("../controllers/adminController.js");

// Get overall stats for Admin Dashboard
router.get("/stats", getAdminStats);

// User Management Routes
router.get("/users", getAllUsers);
router.get("/join-requests", getAdminJoinRequests);
router.route("/users/:id").put(updateUser).delete(deleteUser);
router.put("/join-requests/:id", updateJoinRequestStatus);
// 2. Startup Management Routes (Missing ones causing 404!)
router.route("/startups").get(getAdminStartups).post(createAdminStartup);

router.delete("/startups/:id", deleteAdminStartup);

module.exports = router;
