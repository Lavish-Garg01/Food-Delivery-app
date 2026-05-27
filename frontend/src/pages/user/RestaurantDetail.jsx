import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import useCartStore from "../../context/cartStore";
import toast from "react-hot-toast";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const { addItem, items } = useCartStore();

  useEffect(() => {
    api.get(`/restaurants/${id}`).then((res) => {
      setData(res.data);
      const cats = Object.keys(res.data.menu);
      if (cats.length) setActiveCategory(cats[0]);
      setLoading(false);
    });
  }, [id]);

  const getItemQty = (itemId) => {
    const item = items.find((i) => i._id === itemId);
    return item ? item.quantity : 0;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-spin">🍔</div>
          <p className="text-gray-500 mt-4">Loading menu...</p>
        </div>
      </div>
    );

  const { restaurant, menu } = data;
  const categories = Object.keys(menu);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Banner */}
      <div className="bg-white shadow-sm">
        <div className="h-56 bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-8xl overflow-hidden">
          {restaurant.image ? (
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : "🍽️"}
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
              <p className="text-gray-500 mt-1">{restaurant.cuisine?.join(" • ")}</p>
              <p className="text-gray-400 text-sm mt-1">📍 {restaurant.address?.city}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-green-50 px-4 py-2 rounded-xl">
                <div className="font-bold text-green-700">⭐ {restaurant.rating.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
              <div className="text-center bg-blue-50 px-4 py-2 rounded-xl">
                <div className="font-bold text-blue-700">⏱ {restaurant.deliveryTime}</div>
                <div className="text-xs text-gray-500">Delivery</div>
              </div>
              <div className="text-center bg-orange-50 px-4 py-2 rounded-xl">
                <div className="font-bold text-primary">₹{restaurant.deliveryFee}</div>
                <div className="text-xs text-gray-500">Delivery Fee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-8">
        {/* Category Sidebar */}
        {categories.length > 1 && (
          <div className="hidden md:block w-52 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-32">
              <h3 className="font-bold text-gray-700 mb-3">Menu</h3>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all mb-1 ${
                    activeCategory === cat
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-orange-50 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1">
          {categories.map((cat) => (
            <div key={cat} className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{cat}</h2>
              <div className="space-y-4">
                {menu[cat].map((item) => {
                  const qty = getItemQty(item._id);
                  return (
                    <div key={item._id} className="card p-4 flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center text-xs ${item.isVeg ? "border-green-500" : "border-red-500"}`}>
                            {item.isVeg ? "🟢" : "🔴"}
                          </span>
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{item.description}</p>
                        <p className="font-bold text-gray-800">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        {item.image && (
                          <div className="w-24 h-20 rounded-xl overflow-hidden bg-orange-50">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        {qty === 0 ? (
                          <button
                            onClick={() => addItem(item, restaurant._id, restaurant.name)}
                            className="btn-primary text-sm py-1.5 px-5"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-primary rounded-xl overflow-hidden">
                            <button
                              onClick={() => useCartStore.getState().removeItem(item._id)}
                              className="text-white px-3 py-1.5 hover:bg-orange-600 font-bold"
                            >−</button>
                            <span className="text-white font-bold min-w-[20px] text-center">{qty}</span>
                            <button
                              onClick={() => addItem(item, restaurant._id, restaurant.name)}
                              className="text-white px-3 py-1.5 hover:bg-orange-600 font-bold"
                            >+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}