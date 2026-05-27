const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, isAdmin, createRestaurant);
router.put("/:id", protect, isAdmin, updateRestaurant);
router.delete("/:id", protect, isAdmin, deleteRestaurant);

module.exports = router;