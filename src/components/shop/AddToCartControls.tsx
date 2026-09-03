"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import type { Beer } from "@/types/beer";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

const LOW_STOCK_THRESHOLD = 10;

export function AddToCartControls({ beer, stock }: { beer: Beer; stock: number }) {
  const [qty, setQty] = useState(1);
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const outOfStock = stock <= 0;

  const handleAdd = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    for (let i = 0; i < qty; i++) {
      addItem(beer);
    }
    toast.success("Cerveza agregada al carrito");
  };

  return (
    <div>
      {outOfStock ? (
        <p className="text-sm font-semibold text-red-500">Sin stock por el momento</p>
      ) : stock <= LOW_STOCK_THRESHOLD ? (
        <p className="text-sm font-semibold text-orange">¡Últimas {stock} unidades!</p>
      ) : (
        <p className="text-sm text-dark/50">En stock</p>
      )}

      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-dark/10 px-4 py-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Restar"
            disabled={outOfStock}
            className="text-dark/60 hover:text-orange disabled:pointer-events-none disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span className="w-4 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            aria-label="Sumar"
            disabled={outOfStock || qty >= stock}
            className="text-dark/60 hover:text-orange disabled:pointer-events-none disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold disabled:cursor-not-allowed disabled:bg-dark/10 disabled:text-dark/40"
        >
          {outOfStock ? "Sin stock" : "Agregar Al Carro"}
        </button>
      </div>
      <p className="mt-3 text-sm text-dark/50">
        Subtotal: <span className="font-semibold text-dark">{formatPrice(beer.price * qty)}</span>
      </p>
    </div>
  );
}
