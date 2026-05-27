const Order = require("../models/Order");
const { getIO } = require("../socket/socket");

// @POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress, paymentMethod, notes } =
      req.body;

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = 30;
    const grandTotal = totalAmount + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      restaurant,
      items,
      totalAmount,
      deliveryFee,
      grandTotal,
      deliveryAddress,
      paymentMethod,
      notes,
    });

    // Emit new order to admin via socket
    const io = getIO();
    io.to("admin-room").emit("new-order", order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant", "name image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant", "name image address phone")
      .populate("user", "name email phone");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Allow only owner or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/orders/:id/status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Emit status update to specific user via socket
    const io = getIO();
    io.to(`user-${order.user._id}`).emit("order-status-update", {
      orderId: order._id,
      status: order.status,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders (Admin - all orders)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!["pending", "confirmed"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled at this stage" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
};