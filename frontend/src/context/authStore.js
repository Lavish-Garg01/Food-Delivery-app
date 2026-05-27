import { create } from "zustand";
import api from "../utils/api";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,

  register: async (data) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/register", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      set({ user: res.data, loading: false });
      toast.success("Account created! Welcome 🎉");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      set({ loading: false });
      return false;
    }
  },

  login: async (data) => {
    set({ loading: true });
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      set({ user: res.data, loading: false });
      toast.success(`Welcome back, ${res.data.name}! 👋`);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      set({ loading: false });
      return null;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
    toast.success("Logged out successfully");
  },

  updateUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },
}));

export default useAuthStore;