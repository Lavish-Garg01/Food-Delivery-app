const MenuItem = require("../models/MenuItem");

// @GET /api/menu/:restaurantId
const getMenuByRestaurant = async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurant: req.params.restaurantId,
      isAvailable: true,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/menu (Admin)
const createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/menu/:id (Admin)
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/menu/:id (Admin)
const deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndUpdate(req.params.id, { isAvailable: false });
    res.json({ message: "Menu item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};