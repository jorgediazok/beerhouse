"use client";

import Link from "next/link";
import { Truck, ShieldCheck } from "lucide-react";
import { useCartStore, selectTotalItems, selectTotalPrice } from "@/store/cart-store";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, getShippingCost } from "@/lib/shipping";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const shippingCost = getShippingCost(totalPrice);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;
  const total = totalPrice + shippingCost;

  return (
    <div className="mx-auto min-h-[75vh] max-w-7xl px-6 py-16 lg:px-10">
      <h1 className="text-3xl font-bold">Tu Carrito</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_23rem] lg:gap-16">
        <div className="flex flex-col gap-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-14 text-center shadow-sm">
              <p className="text-xl font-semibold">No hay cervezas en el carro</p>
              <Link
                href="/tienda"
                className="rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
              >
                Ir a la Tienda
              </Link>
            </div>
          ) : (
            items.map((entry) => <CartItemRow key={entry.item.id} entry={entry} />)
          )}
        </div>

        <div className="h-fit rounded-2xl bg-dark p-8 text-cream">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <div className="mt-5 flex items-center justify-between text-cream/55">
            <span>Subtotal ({totalItems} items)</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-cream/55">
            <span>Envío</span>
            <span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
          </div>
          {items.length > 0 && remainingForFreeShipping > 0 && (
            <p className="mt-2 text-xs text-cream/45">
              Te faltan <b className="text-orange">{formatPrice(remainingForFreeShipping)}</b> para
              envío gratis
            </p>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-cream/15 pt-4 text-xl font-bold">
            <span>Total</span>
            <span className="bg-linear-to-r from-orange to-gold bg-clip-text text-transparent">
              {formatPrice(total)}
            </span>
          </div>
          {items.length === 0 ? (
            <span
              aria-disabled="true"
              className="mt-6 block cursor-not-allowed rounded-full bg-cream/10 px-6 py-3.5 text-center font-semibold text-cream/40"
            >
              Terminar Compra
            </span>
          ) : (
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-linear-to-br from-orange to-gold px-6 py-3.5 text-center font-semibold text-dark transition hover:brightness-105"
            >
              Terminar Compra
            </Link>
          )}
          <div className="mt-6 flex flex-col gap-3 border-t border-cream/10 pt-5">
            <div className="flex items-center gap-2.5 text-sm text-cream/50">
              <Truck className="shrink-0 text-orange" size={17} aria-hidden="true" />
              Envío en 24h a todo el país
            </div>
            <div className="flex items-center gap-2.5 text-sm text-cream/50">
              <ShieldCheck className="shrink-0 text-orange" size={17} aria-hidden="true" />
              Pago 100% seguro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
