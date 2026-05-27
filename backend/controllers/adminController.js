const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

// @GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalRestaurants = await Restaurant.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Revenue last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$grandTotal" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
      ordersByStatus,
      dailyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);
    res.json({ users, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/admin/users/:id/toggle
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers, toggleUserStatus };