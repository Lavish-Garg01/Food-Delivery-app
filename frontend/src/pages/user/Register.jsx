import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../context/authStore";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(form);
    if (success) navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍕</div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-1">Join us and start ordering!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" className="input-field" placeholder="John Doe"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input-field" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" className="input-field" placeholder="9876543210"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="input-field" placeholder="Min 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6} required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-center mt-2 disabled:opacity-70">
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}