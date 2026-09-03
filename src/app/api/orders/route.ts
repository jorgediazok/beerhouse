import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order, type OrderItem } from "@/models/Order";
import { getShippingCost } from "@/lib/shipping";
import { getBeerById } from "@/lib/contentful";
import { sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        beerId: z.string().min(1),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
  shipping: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    document: z.string().min(6),
    address: z.string().min(4),
    zipCode: z.string().min(3),
    time: z.string().min(1),
  }),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { items, shipping } = parsed.data;

  // Never trust name/price from the client — resolve every item against
  // Contentful so an order always reflects the real, current catalog data.
  const resolvedItems: OrderItem[] = [];
  for (const item of items) {
    const beer = await getBeerById(item.beerId);
    if (!beer) {
      return NextResponse.json(
        { error: "Uno de los productos de tu carrito ya no está disponible" },
        { status: 400 }
      );
    }
    resolvedItems.push({ beerId: beer.id, name: beer.name, price: beer.price, qty: item.qty });
  }

  const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = getShippingCost(subtotal);
  const total = subtotal + shippingCost;

  await connectDB();
  const order = await Order.create({
    userId: session.user.id,
    items: resolvedItems,
    shipping,
    subtotal,
    shippingCost,
    total,
  });

  const orderNumber = order._id.toString().slice(-8).toUpperCase();

  if (session.user.email) {
    const itemLines = resolvedItems
      .map((item) => `- ${item.name} x${item.qty} — ${formatPrice(item.price * item.qty)}`)
      .join("\n");

    await sendEmail({
      to: session.user.email,
      subject: `Confirmamos tu pedido #${orderNumber} — Beer House`,
      text: `¡Gracias por tu compra!\n\nPedido #${orderNumber}\n\n${itemLines}\n\nSubtotal: ${formatPrice(subtotal)}\nEnvío: ${shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}\nTotal: ${formatPrice(total)}\n\nEnvío a: ${shipping.address} · ${shipping.time}\n\n¡Gracias por elegir Beer House!`,
    });
  }

  return NextResponse.json({ orderId: order._id.toString(), total }, { status: 201 });
}
