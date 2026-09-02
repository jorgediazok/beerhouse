"use client";

import Link from "next/link";
import { useCartStore, selectTotalItems, selectTotalPrice } from "@/store/cart-store";
import { CartItemRow } from "@/components/cart/CartItemRow";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-bold">Tu Carrito</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold">No hay cervezas en el carro</p>
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
          {items.length === 0 ? (
            <span
              aria-disabled="true"
              className="mt-6 block cursor-not-allowed rounded-full bg-dark/10 px-6 py-3 text-center font-semibold text-dark/40"
            >
              Terminar Compra
            </span>
          ) : (
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-orange px-6 py-3 text-center font-semibold text-dark transition hover:bg-gold"
            >
              Terminar Compra
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
