import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  name: "", description: "", image: "", cuisine: "",
  deliveryTime: "30-40 min", deliveryFee: 30, minOrder: 100,
  address: { street: "", city: "", state: "", pincode: "" },
};

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = () =>
    api.get("/restaurants").then((res) => setRestaurants(res.data));

  useEffect(() => { fetchRestaurants(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, cuisine: form.cuisine.split(",").map((c) => c.trim()) };
      if (editId) {
        await api.put(`/restaurants/${editId}`, payload);
        toast.success("Restaurant updated!");
      } else {
        await api.post("/restaurants", payload);
        toast.success("Restaurant added!");
      }
      fetchRestaurants();
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
    } catch { toast.error("Something went wrong"); }
    setLoading(false);
  };

  const handleEdit = (r) => {
    setForm({ ...r, cuisine: r.cuisine?.join(", ") || "" });
    setEditId(r._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    await api.delete(`/restaurants/${id}`);
    toast.success("Restaurant removed");
    fetchRestaurants();
  };

  const handleToggle = async (id, isOpen) => {
    await api.put(`/restaurants/${id}`, { isOpen: !isOpen });
    fetchRestaurants();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🍽️ Restaurants</h1>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }} className="btn-primary">
            + Add Restaurant
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editId ? "Edit" : "Add"} Restaurant</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input className="input-field" placeholder="Restaurant Name *" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-span-2">
                  <input className="input-field" placeholder="Description" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <input className="input-field" placeholder="Image URL" value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <input className="input-field" placeholder="Cuisines (comma separated e.g. Pizza, Italian)" value={form.cuisine}
                    onChange={(e) => setForm({ ...form, cuisine: e.target.value })} />
                </div>
                <input className="input-field" placeholder="Delivery Time" value={form.deliveryTime}
                  onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} />
                <input className="input-field" type="number" placeholder="Delivery Fee" value={form.deliveryFee}
                  onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })} />
                <input className="input-field" placeholder="Street" value={form.address?.street || ""}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
                <input className="input-field" placeholder="City" value={form.address?.city || ""}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
                <input className="input-field" placeholder="State" value={form.address?.state || ""}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
                <input className="input-field" placeholder="Pincode" value={form.address?.pincode || ""}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, pincode: e.target.value } })} />
                <div className="col-span-2 flex gap-3 mt-2">
                  <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
                    {loading ? "Saving..." : editId ? "Update" : "Add Restaurant"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Restaurants Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Restaurant</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cuisine</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Rating</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {restaurants.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl overflow-hidden">
                        {r.image ? <img src={r.image} alt={r.name} className="w-full h-full object-cover" /> : "🍽️"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{r.name}</p>
                        <p className="text-gray-400 text-xs">{r.address?.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{r.cuisine?.join(", ")}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
                      ⭐ {r.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggle(r._id, r.isOpen)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${r.isOpen ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>
                      {r.isOpen ? "Open" : "Closed"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/menu/${r._id}`} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Menu</Link>
                      <button onClick={() => handleEdit(r)} className="text-primary hover:text-orange-700 text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(r._id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Delete</button>
                    </div>
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