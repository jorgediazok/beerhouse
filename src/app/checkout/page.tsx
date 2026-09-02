import type { Metadata } from "next";
import { CheckoutView } from "./CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Completá tus datos de entrega y pago para finalizar tu compra.",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
