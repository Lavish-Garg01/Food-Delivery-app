const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

// @GET /api/restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const { city, cuisine, search } = req.query;
    let query = { isActive: true };

    if (city) query["address.city"] = { $regex: city, $options: "i" };
    if (cuisine) query.cuisine = { $in: [cuisine] };
    if (search) query.name = { $regex: search, $options: "i" };

    const restaurants = await Restaurant.find(query).sort({ rating: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/restaurants/:id
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const menuItems = await MenuItem.find({
      restaurant: req.params.id,
      isAvailable: true,
    });

    // Group menu by category
    const menu = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({ restaurant, menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/restaurants (Admin)
const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/restaurants/:id (Admin)
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/restaurants/:id (Admin)
const deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};