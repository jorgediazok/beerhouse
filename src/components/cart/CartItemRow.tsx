"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { useCartStore } from "@/store/cart-store";
import { ProductImage } from "@/components/ui/ProductImage";

export function CartItemRow({ entry }: { entry: CartItem }) {
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream">
        {entry.item.imageUrl && (
          <ProductImage
            src={entry.item.imageUrl}
            alt={entry.item.name}
            fill
            sizes="80px"
            className="object-contain p-2"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{entry.item.name}</p>
        <p className="line-clamp-1 text-sm text-dark/60">{entry.item.description}</p>
        <p className="mt-1 text-sm">
          Precio p/u: <b>$ {entry.item.price}</b>
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-dark/10 px-3 py-1">
        <button
          onClick={() => decreaseItem(entry.item.id)}
          aria-label="Restar"
          className="text-dark/60 hover:text-orange"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center">{entry.qty}</span>
        <button
          onClick={() => increaseItem(entry.item.id)}
          aria-label="Sumar"
          className="text-dark/60 hover:text-orange"
        >
          <Plus size={14} />
        </button>
      </div>
      <button
        onClick={() => removeItem(entry.item.id)}
        aria-label="Eliminar"
        className="text-dark/40 hover:text-red-500"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
