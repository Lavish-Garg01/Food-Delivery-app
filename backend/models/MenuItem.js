const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: String, required: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    isVeg: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);