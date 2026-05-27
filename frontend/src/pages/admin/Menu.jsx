import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../utils/api";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  name: "", description: "", price: "", category: "",
  image: "", isVeg: false, isAvailable: true, restaurant: "",
};

export default function AdminMenu() {
  const { restaurantId } = useParams();
  const [items, setItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [menuRes, restRes] = await Promise.all([
      api.get(`/menu/${restaurantId}`),
      api.get(`/restaurants/${restaurantId}`),
    ]);
    setItems(menuRes.data);
    setRestaurant(restRes.data.restaurant);
  };

  useEffect(() => { fetchData(); }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), restaurant: restaurantId };
      if (editId) {
        await api.put(`/menu/${editId}`, payload);
        toast.success("Item updated!");
      } else {
        await api.post("/menu", payload);
        toast.success("Item added!");
      }
      fetchData();
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
    } catch { toast.error("Something went wrong"); }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item?")) return;
    await api.delete(`/menu/${id}`);
    toast.success("Item removed");
    fetchData();
  };

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🍽️ Menu Items</h1>
            {restaurant && <p className="text-gray-500">{restaurant.name}</p>}
          </div>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }} className="btn-primary">
            + Add Item
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editId ? "Edit" : "Add"} Menu Item</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input className="input-field" placeholder="Item Name *" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <textarea className="input-field resize-none" rows={2} placeholder="Description"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <input className="input-field" type="number" placeholder="Price ₹ *" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  <input className="input-field" placeholder="Category *" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                </div>
                <input className="input-field" placeholder="Image URL" value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isVeg}
                      onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} className="w-4 h-4 accent-green-500" />
                    <span className="font-medium text-gray-700">🟢 Veg</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isAvailable}
                      onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                    <span className="font-medium text-gray-700">Available</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
                    {loading ? "Saving..." : editId ? "Update" : "Add Item"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items by Category */}
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500">No items yet. Add some!</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200">{cat}</h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Item</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Price</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Type</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.filter((i) => i.category === cat).map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center overflow-hidden">
                              {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : "🍽️"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{item.name}</p>
                              <p className="text-gray-400 text-xs truncate max-w-[200px]">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">₹{item.price}</td>
                        <td className="px-6 py-4">
                          <span className={`badge px-2 py-1 text-xs font-semibold ${item.isVeg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge px-2 py-1 text-xs font-semibold ${item.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(item)} className="text-primary hover:text-orange-700 text-sm font-medium">Edit</button>
                            <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}