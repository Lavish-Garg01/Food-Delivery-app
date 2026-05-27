const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
        name: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 30 },
    grandTotal: { type: Number, required: true },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    stripePaymentId: { type: String, default: "" },
    estimatedDelivery: { type: String, default: "30-40 min" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);