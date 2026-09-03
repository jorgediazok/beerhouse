import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CheckoutView } from "./CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Completá tus datos de entrega y pago para finalizar tu compra.",
  robots: { index: false, follow: true },
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  return <CheckoutView />;
}
