const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

// @POST /api/payment/create-checkout-session
const createCheckoutSession = async (req, res) => {
  try {
    const { items, orderId } = req.body;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery fee
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Fee" },
        unit_amount: 3000,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order-success?orderId=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: { orderId: orderId.toString() },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/payment/webhook (Stripe webhook)
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      stripePaymentId: session.payment_intent,
      status: "confirmed",
    });
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };