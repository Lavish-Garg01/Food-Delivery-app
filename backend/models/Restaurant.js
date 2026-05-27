const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    cuisine: [{ type: String }],
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    deliveryTime: { type: String, default: "30-40 min" },
    deliveryFee: { type: Number, default: 30 },
    minOrder: { type: Number, default: 100 },
    isOpen: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);