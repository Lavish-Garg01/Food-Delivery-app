import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_EMOJI = {
  pending: "⏳", confirmed: "✅", preparing: "👨‍🍳",
  out_for_delivery: "🚴", delivered: "🎉", cancelled: "❌",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my-orders").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-spin">🍔</div></div>;

  if (orders.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-700">No orders yet</h2>
          <p className="text-gray-500 mt-2">Order something delicious!</p>
          <Link to="/restaurants" className="btn-primary inline-block mt-6">Browse Restaurants</Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📦 My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 block hover:border-primary hover:border-2 border-2 border-transparent transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{order.restaurant?.image ? "" : "🍽️"}</span>
                    <h3 className="font-bold text-gray-800">{order.restaurant?.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">
                    {order.items.length} item(s) • ₹{order.grandTotal}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className={`badge px-3 py-1 text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
                  {STATUS_EMOJI[order.status]} {order.status.replace(/_/g, " ")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}