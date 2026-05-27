import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../context/authStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(form);
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍔</div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500 mt-1">Login to continue ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-center mt-2 disabled:opacity-70">
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}