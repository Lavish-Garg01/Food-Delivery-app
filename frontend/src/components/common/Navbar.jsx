import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../context/authStore";
import useCartStore from "../../context/cartStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const getCount = useCartStore((s) => s.getCount);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-bold text-primary">FoodRush</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
            <Link to="/restaurants" className="text-gray-600 hover:text-primary font-medium transition-colors">Restaurants</Link>
            {user && (
              <Link to="/orders" className="text-gray-600 hover:text-primary font-medium transition-colors">My Orders</Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="text-primary font-semibold">Admin Panel</Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 hover:bg-orange-50 rounded-xl transition-colors">
                  <span className="text-2xl">🛒</span>
                  {getCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {getCount()}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 hover:bg-orange-50 rounded-xl px-3 py-2 transition-colors">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-gray-700 font-medium text-sm">{user.name}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-primary rounded-t-2xl transition-colors text-sm font-medium">
                      👤 My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors text-sm font-medium">
                      📦 My Orders
                    </Link>
                    <hr className="mx-4" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-b-2xl transition-colors text-sm font-medium"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}