import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS = ["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterStatus) params.append("status", filterStatus);
      const res = await api.get(`/orders/all?${params}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.pages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filterStatus, page]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success("Status updated!");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📦 All Orders</h1>
          {/* Filter */}
          <select
            className="input-field w-48"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Restaurant</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{order.user?.name}</p>
                    <p className="text-gray-400 text-xs">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.restaurant?.name}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">₹{order.grandTotal}</td>
                  <td className="px-6 py-4">
                    <span className={`badge px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                      {order.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.status !== "delivered" && order.status !== "cancelled" ? (
                      <select
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-primary"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50 hover:border-primary text-sm font-medium">
              ← Prev
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-50 hover:border-primary text-sm font-medium">
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}