const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/dashboard", protect, isAdmin, getDashboardStats);
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/users/:id/toggle", protect, isAdmin, toggleUserStatus);

module.exports = router;