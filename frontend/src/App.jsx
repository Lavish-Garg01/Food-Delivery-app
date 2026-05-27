import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./context/authStore";

// Pages - User
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Restaurants from "./pages/user/Restaurants";
import RestaurantDetail from "./pages/user/RestaurantDetail";
import Cart from "./pages/user/Cart";
import Orders from "./pages/user/Orders";
import OrderDetail from "./pages/user/OrderDetail";
import Profile from "./pages/user/Profile";
import OrderSuccess from "./pages/user/OrderSuccess";

// Pages - Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRestaurants from "./pages/admin/Restaurants";
import AdminMenu from "./pages/admin/Menu";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";

// Components
import Navbar from "./components/common/Navbar";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? <Navigate to="/" /> : children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* User Routes */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/restaurants" element={<><Navbar /><Restaurants /></>} />
        <Route path="/restaurant/:id" element={<><Navbar /><RestaurantDetail /></>} />
        <Route path="/cart" element={<ProtectedRoute><Navbar /><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Navbar /><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><Navbar /><OrderDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Navbar /><Profile /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/restaurants" element={<AdminRoute><AdminRestaurants /></AdminRoute>} />
        <Route path="/admin/menu/:restaurantId" element={<AdminRoute><AdminMenu /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}