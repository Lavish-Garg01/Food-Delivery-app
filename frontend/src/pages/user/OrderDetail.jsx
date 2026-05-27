import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../utils/api";
import useAuthStore from "../../context/authStore";
import toast from "react-hot-toast";

const STEPS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const STEP_LABELS = {
  pending: "Order Placed", confirmed: "Confirmed", preparing: "Preparing",
  out_for_delivery: "Out for Delivery", delivered: "Delivered",
};
const STEP_EMOJI = { pending: "📋", confirmed: "✅", preparing: "👨‍🍳", out_for_delivery: "🚴", delivered: "🎉" };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));

    // Real-time status updates via socket
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.emit("join-user", user._id);
    socket.on("order-status-update", ({ orderId, status }) => {
      if (orderId === id) {
        setOrder((prev) => ({ ...prev, status }));
        toast.success(`Order status: ${status.replace(/_/g, " ")} 🎉`);
      }
    });
    return () => socket.disconnect();
  }, [id]);

  const handleCancel = async () => {
    try {
      await api.put(`/orders/${id}/cancel`);
      setOrder((prev) => ({ ...prev, status: "cancelled" }));
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot cancel order");
    }
  };

  if (!order)
    return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-spin">🍔</div></div>;

  const currentStep = STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Details</h1>
        <p className="text-gray-400 text-sm mb-6">Order ID: {order._id}</p>

        {/* Status Tracker */}
        {!isCancelled ? (
          <div className="card p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-6">🚀 Order Tracking</h3>
            <div className="flex items-start justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0"></div>
              <div
                className="absolute top-5 left-0 h-1 bg-primary z-0 transition-all duration-500"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              ></div>
              {STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-4 ${
                    i <= currentStep ? "bg-primary border-primary text-white" : "bg-white border-gray-200"
                  } transition-all`}>
                    {STEP_EMOJI[step]}
                  </div>
                  <p className={`text-xs mt-2 text-center font-medium ${i <= currentStep ? "text-primary" : "text-gray-400"}`}>
                    {STEP_LABELS[step]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-6 mb-6 bg-red-50 border border-red-200">
            <p className="text-red-600 font-semibold text-center text-lg">❌ This order was cancelled</p>
          </div>
        )}

        {/* Restaurant */}
        <div className="card p-5 mb-4">
          <h3 className="font-bold text-gray-800 mb-1">🍽️ {order.restaurant?.name}</h3>
          <p className="text-gray-500 text-sm">📍 {order.restaurant?.address?.city}</p>
        </div>

        {/* Items */}
        <div className="card p-5 mb-4">
          <h3 className="font-bold text-gray-800 mb-4">🛒 Items Ordered</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} × {item.quantity}</span>
                <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span><span>₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-base">
              <span>Grand Total</span><span className="text-primary">₹{order.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="card p-5 mb-4">
          <h3 className="font-bold text-gray-800 mb-2">📍 Delivery Address</h3>
          <p className="text-gray-600 text-sm">
            {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
          </p>
        </div>

        {/* Payment */}
        <div className="card p-5 mb-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-semibold text-gray-800 capitalize">{order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Online"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className={`font-semibold capitalize ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                {order.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {["pending", "confirmed"].includes(order.status) && (
          <button onClick={handleCancel} className="w-full border-2 border-red-400 text-red-500 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}