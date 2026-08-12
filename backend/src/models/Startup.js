// backend/src/models/Startup.js

const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
  {
    startupName: {
      type: String,
      required: [true, "Please add a startup name"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Please add a description"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seatsNeeded: {
      type: Number,
      required: [true, "Please add number of people needed"],
      default: 1,
    },

    founded: {
      type: Number,
      default: null,
    },

    size: {
      type: String,
      default: "",
      trim: true,
    },

    funding: {
      type: String,
      default: "",
      trim: true,
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    whatsappNumber: {
      type: String,
      required: [true, "Please add a WhatsApp number"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Startup", startupSchema);
