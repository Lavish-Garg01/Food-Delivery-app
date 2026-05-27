import { useState } from "react";
import useAuthStore from "../../context/authStore";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/profile", form);
      updateUser({ ...user, ...res.data });
      toast.success("Profile updated! ✅");
    } catch {
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 My Profile</h1>

        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-xl">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <span className={`badge mt-1 ${user?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="input-field" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="input-field bg-gray-50" value={user?.email} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" className="input-field" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}