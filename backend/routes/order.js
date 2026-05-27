const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/all", protect, isAdmin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;