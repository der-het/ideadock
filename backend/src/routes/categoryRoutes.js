// backend/src/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Get all categories & Create new category
router.route("/").get(getCategories).post(createCategory);

// Update & Delete category by ID
router.route("/:id").put(updateCategory).delete(deleteCategory);

module.exports = router;
