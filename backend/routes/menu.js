const express = require("express");
const router = express.Router();
const {
  getMenuByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/:restaurantId", getMenuByRestaurant);
router.post("/", protect, isAdmin, createMenuItem);
router.put("/:id", protect, isAdmin, updateMenuItem);
router.delete("/:id", protect, isAdmin, deleteMenuItem);

module.exports = router;