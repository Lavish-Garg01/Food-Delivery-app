import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../context/cartStore";
import useAuthStore from "../../context/authStore";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function Cart() {
  const { items, restaurantId, restaurantName, addItem, removeItem, deleteItem, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const deliveryFee = 30;
  const total = getTotal();

  if (items.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Add items from a restaurant to get started!</p>
          <Link to="/restaurants" className="btn-primary inline-block mt-6">Browse Restaurants</Link>
        </div>
      </div>
    );

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.pincode) {
      return toast.error("Please fill in your delivery address");
    }
    setLoading(true);
    try {
      const orderData = {
        restaurant: restaurantId,
        items: items.map((i) => ({ menuItem: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        deliveryAddress: address,
        paymentMethod,
      };

      const res = await api.post("/orders", orderData);

      if (paymentMethod === "online") {
        const payRes = await api.post("/payment/create-checkout-session", {
          items: items,
          orderId: res.data._id,
        });
        window.location.href = payRes.data.url;
      } else {
        clearCart();
        navigate(`/order-success?orderId=${res.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">🛒 Your Cart</h1>
        <p className="text-gray-500 mb-4">From: <span className="font-semibold text-gray-700">{restaurantName}</span></p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="card p-4 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-primary font-bold">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 rounded-xl overflow-hidden">
                  <button onClick={() => removeItem(item._id)} className="px-3 py-2 hover:bg-orange-100 font-bold text-primary">−</button>
                  <span className="font-bold text-gray-800 min-w-[24px] text-center">{item.quantity}</span>
                  <button onClick={() => addItem(item, restaurantId, restaurantName)} className="px-3 py-2 hover:bg-orange-100 font-bold text-primary">+</button>
                </div>
                <p className="font-bold text-gray-800 min-w-[60px] text-right">₹{item.price * item.quantity}</p>
                <button onClick={() => deleteItem(item._id)} className="text-red-400 hover:text-red-600 text-xl ml-2">×</button>
              </div>
            ))}

            {/* Delivery Address */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-4">📍 Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input-field" placeholder="Street / Area" value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                <input className="input-field" placeholder="City" value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input className="input-field" placeholder="State" value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                <input className="input-field" placeholder="Pincode" value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-800 mb-4">💳 Payment Method</h3>
              <div className="flex gap-4">
                {[
                  { value: "cod", label: "💵 Cash on Delivery" },
                  { value: "online", label: "💳 Pay Online (Stripe)" },
                ].map((m) => (
                  <label key={m.value} className={`flex-1 border-2 rounded-xl p-3 cursor-pointer text-center transition-all ${paymentMethod === m.value ? "border-primary bg-orange-50 text-primary" : "border-gray-200"}`}>
                    <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)} className="hidden" />
                    <span className="font-medium">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span><span>₹{deliveryFee}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800 text-base">
                  <span>Grand Total</span><span className="text-primary">₹{total + deliveryFee}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full mt-6 text-center disabled:opacity-70"
              >
                {loading ? "Placing Order..." : paymentMethod === "online" ? "Pay & Order →" : "Place Order →"}
              </button>
              <button onClick={clearCart} className="w-full mt-3 text-red-400 hover:text-red-600 text-sm font-medium">
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}