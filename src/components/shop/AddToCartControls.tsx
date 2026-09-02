"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import type { Beer } from "@/types/beer";
import { useCartStore } from "@/store/cart-store";

export function AddToCartControls({ beer }: { beer: Beer }) {
  const [qty, setQty] = useState(1);
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

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
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 rounded-full border border-dark/10 px-4 py-2">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Restar"
          className="text-dark/60 hover:text-orange"
        >
          <Minus size={16} />
        </button>
        <span className="w-4 text-center">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          aria-label="Sumar"
          className="text-dark/60 hover:text-orange"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={handleAdd}
        className="rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
      >
        Agregar Al Carro
      </button>
    </div>
  );
}
