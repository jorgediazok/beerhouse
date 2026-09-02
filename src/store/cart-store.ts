import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beer } from "@/types/beer";
import type { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  addItem: (beer: Beer) => void;
  increaseItem: (beerId: string) => void;
  decreaseItem: (beerId: string) => void;
  removeItem: (beerId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (beer) =>
        set((state) => {
          const existing = state.items.find((entry) => entry.item.id === beer.id);
          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.item.id === beer.id ? { ...entry, qty: entry.qty + 1 } : entry
              ),
            };
          }
          return { items: [...state.items, { item: beer, qty: 1 }] };
        }),
      increaseItem: (beerId) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.item.id === beerId ? { ...entry, qty: entry.qty + 1 } : entry
          ),
        })),
      decreaseItem: (beerId) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.item.id === beerId
              ? { ...entry, qty: Math.max(1, entry.qty - 1) }
              : entry
          ),
        })),
      removeItem: (beerId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.item.id !== beerId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "beerhouse-cart",
      skipHydration: true,
    }
  )
);

export const selectTotalItems = (state: CartState) =>
  state.items.reduce((total, entry) => total + entry.qty, 0);

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((total, entry) => total + entry.qty * entry.item.price, 0);
