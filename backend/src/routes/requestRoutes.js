// backend/src/routes/requestRoutes.js
const express = require("express");
const router = express.Router();
const {
  createJoinRequest,
  getAllRequests,
  getUserRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

// Submit join request & Get all join requests
router.route("/").get(getAllRequests).post(createJoinRequest);

// Get join requests submitted by a specific user
router.get("/user/:userId", getUserRequests);

// Update status (Accept / Reject)
router.put("/:id/status", updateRequestStatus);

module.exports = router;
