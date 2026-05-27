import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle`);
      toast.success(res.data.message);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">👥 Users</h1>
          <div className="relative w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              className="input-field pl-10"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No users found</td></tr>
              ) : users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`badge px-2 py-1 text-xs font-semibold ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge px-2 py-1 text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleToggle(user._id)}
                        className={`text-sm font-medium transition-colors ${user.isActive ? "text-red-400 hover:text-red-600" : "text-green-500 hover:text-green-700"}`}
                      >
                        {user.isActive ? "Block" : "Unblock"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}