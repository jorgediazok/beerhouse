"use client";

import Link from "next/link";
import { useCartStore, selectTotalItems, selectTotalPrice } from "@/store/cart-store";
import { CartItemRow } from "@/components/cart/CartItemRow";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-10 text-center shadow-sm">
            <h1 className="text-xl font-semibold">No hay cervezas en el carro</h1>
            <Link
              href="/tienda"
              className="rounded-full bg-orange px-6 py-2 font-semibold text-dark transition hover:bg-gold"
            >
              Ir a la Tienda
            </Link>
          </div>
        ) : (
          items.map((entry) => <CartItemRow key={entry.item.id} entry={entry} />)
        )}
      </div>

      <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold">En tu carro:</h2>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Total ({totalItems} items)</span>
          <span className="font-bold">$ {totalPrice}</span>
        </div>
        <Link
          href="/checkout"
          aria-disabled={items.length === 0}
          className={`mt-6 block rounded-full px-6 py-3 text-center font-semibold transition ${
            items.length === 0
              ? "pointer-events-none bg-dark/10 text-dark/40"
              : "bg-orange text-dark hover:bg-gold"
          }`}
        >
          Terminar Compra
        </Link>
      </div>
    </div>
  );
}
