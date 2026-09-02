import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisá las cervezas que agregaste antes de finalizar tu compra.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
