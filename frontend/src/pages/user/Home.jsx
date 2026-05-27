import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);

  useEffect(() => {
    api.get("/restaurants").then((res) => setFeaturedRestaurants(res.data.slice(0, 6)));
  }, []);

  const categories = [
    { name: "Pizza", emoji: "🍕" },
    { name: "Burger", emoji: "🍔" },
    { name: "Biryani", emoji: "🍛" },
    { name: "Chinese", emoji: "🍜" },
    { name: "Desserts", emoji: "🍰" },
    { name: "South Indian", emoji: "🥘" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Hungry? We've Got <br />
              <span className="text-yellow-300">You Covered! 🍔</span>
            </h1>
            <p className="text-orange-100 text-lg mb-8">
              Order from your favorite restaurants and get it delivered in 30 minutes.
            </p>
            <Link to="/restaurants" className="bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
              Order Now →
            </Link>
          </div>
          <div className="text-8xl animate-bounce">🍔</div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🍽️ What's on your mind?</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/restaurants?cuisine=${cat.name}`}
              className="card p-4 text-center hover:border-primary hover:border-2 border-2 border-transparent transition-all cursor-pointer"
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="text-sm font-semibold text-gray-700">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">⭐ Top Restaurants</h2>
            <Link to="/restaurants" className="text-primary font-semibold hover:underline">See all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((r) => (
              <Link key={r._id} to={`/restaurant/${r._id}`} className="card overflow-hidden group">
                <div className="h-48 bg-orange-100 flex items-center justify-center text-6xl overflow-hidden">
                  {r.image ? (
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : "🍽️"}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{r.name}</h3>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-semibold">
                      ⭐ {r.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{r.cuisine?.join(", ")}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>⏱ {r.deliveryTime}</span>
                    <span>•</span>
                    <span>🚴 ₹{r.deliveryFee} delivery</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}