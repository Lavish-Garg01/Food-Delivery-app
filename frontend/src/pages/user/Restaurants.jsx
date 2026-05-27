import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../utils/api";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const cuisine = searchParams.get("cuisine") || "";

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (cuisine) params.append("cuisine", cuisine);
        const res = await api.get(`/restaurants?${params}`);
        setRestaurants(res.data);
      } catch {}
      setLoading(false);
    };
    const timer = setTimeout(fetchRestaurants, 300);
    return () => clearTimeout(timer);
  }, [search, cuisine]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search restaurants or cuisines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {cuisine && (
              <span className="bg-orange-100 text-primary px-4 py-2 rounded-xl font-medium text-sm">
                {cuisine} ×
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-0 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-gray-700">No restaurants found</h3>
            <p className="text-gray-500 mt-2">Try a different search</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4 font-medium">{restaurants.length} restaurants found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((r) => (
                <Link key={r._id} to={`/restaurant/${r._id}`} className="card overflow-hidden group">
                  <div className="h-48 bg-orange-100 flex items-center justify-center text-6xl overflow-hidden relative">
                    {r.image ? (
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : <span>🍽️</span>}
                    {!r.isOpen && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-1 rounded-full font-semibold">Closed</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-800 text-lg truncate">{r.name}</h3>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-semibold shrink-0 ml-2">
                        ⭐ {r.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 truncate">{r.cuisine?.join(" • ")}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
                      <span>⏱ {r.deliveryTime}</span>
                      <span>•</span>
                      <span>🚴 ₹{r.deliveryFee}</span>
                      <span>•</span>
                      <span>Min ₹{r.minOrder}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}