// backend/src/models/JoinRequest.js
const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roleRequested: {
      type: String,
      required: [true, "Please specify a role"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please add an introduction message"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
