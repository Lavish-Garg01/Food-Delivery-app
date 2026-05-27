import { create } from "zustand";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: "",

  addItem: (item, restaurantId, restaurantName) => {
    const { items, restaurantId: currentRestaurantId } = get();

    // Different restaurant — clear cart
    if (currentRestaurantId && currentRestaurantId !== restaurantId) {
      const confirmed = window.confirm(
        "Your cart has items from another restaurant. Clear cart and add new item?"
      );
      if (!confirmed) return;
      set({ items: [], restaurantId: null, restaurantName: "" });
    }

    const existing = items.find((i) => i._id === item._id);
    if (existing) {
      set({
        items: items.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({
        items: [...items, { ...item, quantity: 1 }],
        restaurantId,
        restaurantName,
      });
    }
    toast.success(`${item.name} added to cart! 🛒`);
  },

  removeItem: (itemId) => {
    const { items } = get();
    const updated = items
      .map((i) => (i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
      .filter((i) => i.quantity > 0);
    set({ items: updated, restaurantId: updated.length ? get().restaurantId : null });
  },

  deleteItem: (itemId) => {
    const updated = get().items.filter((i) => i._id !== itemId);
    set({ items: updated, restaurantId: updated.length ? get().restaurantId : null });
  },

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: "" }),

  getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

export default useCartStore;