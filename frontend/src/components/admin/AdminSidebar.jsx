import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../context/authStore";

const navItems = [
  { path: "/admin", label: "Dashboard", emoji: "📊" },
  { path: "/admin/restaurants", label: "Restaurants", emoji: "🍽️" },
  { path: "/admin/orders", label: "Orders", emoji: "📦" },
  { path: "/admin/users", label: "Users", emoji: "👥" },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-dark min-h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="text-white font-bold text-xl">FoodRush</span>
        </Link>
        <p className="text-orange-300 text-xs mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              pathname === item.path
                ? "bg-primary text-white shadow-lg"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-gray-400 text-xs">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-white/10 rounded-xl transition-colors text-left">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}