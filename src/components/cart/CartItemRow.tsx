"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { productImageSrc } from "@/lib/images";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { ProductImage } from "@/components/ui/ProductImage";

export function CartItemRow({ entry }: { entry: CartItem }) {
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = entry.item.price * entry.qty;

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-cream">
          <ProductImage
            src={productImageSrc(entry.item.id)}
            alt={entry.item.name}
            fill
            sizes="112px"
            className="object-contain p-3"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold">{entry.item.name}</p>
          <p className="line-clamp-1 mt-1 text-dark/60">{entry.item.description}</p>
          <p className="mt-2 text-sm text-dark/55">
            Precio p/u: <b className="text-dark">{formatPrice(entry.item.price)}</b>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-8">
        <p className="text-xl font-bold text-dark">{formatPrice(subtotal)}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-dark/10 px-4 py-2">
            <button
              onClick={() => decreaseItem(entry.item.id)}
              aria-label="Restar"
              className="text-dark/60 hover:text-orange"
            >
              <Minus size={18} />
            </button>
            <span className="w-5 text-center text-lg">{entry.qty}</span>
            <button
              onClick={() => increaseItem(entry.item.id)}
              aria-label="Sumar"
              className="text-dark/60 hover:text-orange"
            >
              <Plus size={18} />
            </button>
          </div>
          <button
            onClick={() => removeItem(entry.item.id)}
            aria-label="Eliminar"
            className="text-dark/40 hover:text-red-500"
          >
            <Trash2 size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
