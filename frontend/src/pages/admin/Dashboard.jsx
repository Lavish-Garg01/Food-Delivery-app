import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../utils/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data)
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-4xl animate-spin">🍔</div>
        </div>
      </div>
    );

  const { stats, recentOrders, ordersByStatus, dailyRevenue } = data;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats.totalUsers, emoji: "👥", color: "bg-blue-50 text-blue-700" },
            { label: "Restaurants", value: stats.totalRestaurants, emoji: "🍽️", color: "bg-orange-50 text-orange-700" },
            { label: "Total Orders", value: stats.totalOrders, emoji: "📦", color: "bg-purple-50 text-purple-700" },
            { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, emoji: "💰", color: "bg-green-50 text-green-700" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {s.emoji}
              </div>
              <div className="text-2xl font-bold text-gray-800">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Order Status Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Orders by Status</h3>
            <div className="space-y-2">
              {ordersByStatus.map((s) => (
                <div key={s._id} className="flex items-center justify-between">
                  <span className={`badge px-3 py-1 ${STATUS_COLORS[s._id] || "bg-gray-100 text-gray-600"} capitalize`}>
                    {s._id?.replace(/_/g, " ")}
                  </span>
                  <span className="font-bold text-gray-800">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Recent Orders</h3>
              <Link to="/admin/orders" className="text-primary text-sm hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{order.user?.name}</p>
                    <p className="text-gray-500 text-xs">{order.restaurant?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{order.grandTotal}</p>
                    <span className={`badge text-xs ${STATUS_COLORS[order.status]}`}>
                      {order.status?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}