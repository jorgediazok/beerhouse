import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageOpen, CircleHelp } from "lucide-react";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { productImageSrc } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice, formatDate } from "@/lib/format";
import { getOrderStatus } from "@/lib/orderStatus";
import { OrderStatusStepper } from "@/components/pedidos/OrderStatusStepper";

export const metadata: Metadata = {
  title: "Mis Pedidos",
  description: "Historial de tus pedidos en Beer House.",
  robots: { index: false, follow: true },
};

export default async function PedidosPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/pedidos");
  }

  await connectDB();
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

  return (
    <div className="mx-auto min-h-[75vh] max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-white p-14 text-center shadow-sm">
          <PackageOpen className="text-dark/30" size={48} aria-hidden="true" />
          <p className="text-xl font-semibold">Todavía no hiciste ningún pedido</p>
          <Link
            href="/tienda"
            className="rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
          >
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-7">
          {orders.map((order) => {
            const { status, label } = getOrderStatus(order.createdAt);

            return (
              <div key={order._id.toString()} className="rounded-2xl bg-white p-7 shadow-sm sm:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dark/10 pb-5">
                  <div>
                    <p className="text-lg font-bold text-dark">
                      Pedido #{order._id.toString().slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-sm text-dark/50">{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                      status === "entregado"
                        ? "bg-emerald-500/15 text-emerald-700"
                        : "bg-orange/15 text-orange"
                    }`}
                  >
                    {label}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-4">
                  {order.items.map((item) => (
                    <div key={item.beerId} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                        <ProductImage
                          src={productImageSrc(item.beerId)}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-dark">{item.name}</p>
                        <p className="text-sm text-dark/50">x{item.qty}</p>
                      </div>
                      <p className="font-semibold text-dark">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-dark/10 pt-6">
                  <OrderStatusStepper current={status} />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dark/10 pt-5">
                  <p className="text-sm text-dark/55">
                    Envío a {order.shipping.address} · {order.shipping.time}
                  </p>
                  <p className="text-lg font-bold text-dark">Total: {formatPrice(order.total)}</p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-dashed border-dark/10 pt-4 text-sm text-dark/50">
                  <CircleHelp className="shrink-0 text-orange" size={16} aria-hidden="true" />
                  <p>
                    ¿Tuviste algún problema con este pedido?{" "}
                    <Link href="/#contacto" className="font-semibold text-orange underline hover:text-dark">
                      Contactanos
                    </Link>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
