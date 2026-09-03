import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order, type OrderItem } from "@/models/Order";
import { getShippingCost } from "@/lib/shipping";
import { getBeerById } from "@/lib/contentful";
import { sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { decrementStock, incrementStock } from "@/lib/stock";
import { mpPayment, paymentRejectionMessage } from "@/lib/mercadopago";

const paymentSchema = z.object({
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
  card: z.object({
    token: z.string().min(1),
    issuer_id: z.string().min(1),
    payment_method_id: z.string().min(1),
    installments: z.number().int().positive(),
    payer: z.object({
      email: z.string().email(),
      identification: z.object({ type: z.string(), number: z.string() }).optional(),
    }),
  }),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { items, shipping, card } = parsed.data;

  // Never trust name/price from the client — resolve every item against
  // Contentful so a charge always reflects the real, current catalog data.
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

  // Reserve stock for every item before charging the card. If any item runs
  // out partway through, roll back what already succeeded.
  const reserved: { beerId: string; qty: number }[] = [];
  for (const item of resolvedItems) {
    const ok = await decrementStock(item.beerId, item.qty);
    if (!ok) {
      for (const entry of reserved) {
        await incrementStock(entry.beerId, entry.qty);
      }
      return NextResponse.json(
        { error: `No queda stock suficiente de "${item.name}"` },
        { status: 400 }
      );
    }
    reserved.push({ beerId: item.beerId, qty: item.qty });
  }

  const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = getShippingCost(subtotal);
  const total = subtotal + shippingCost;

  let payment;
  try {
    payment = await mpPayment.create({
      body: {
        transaction_amount: total,
        token: card.token,
        installments: card.installments,
        payment_method_id: card.payment_method_id,
        issuer_id: Number(card.issuer_id),
        payer: card.payer,
        description: "Pedido Beer House",
        binary_mode: true,
      },
      requestOptions: { idempotencyKey: randomUUID() },
    });
  } catch (err) {
    console.error("MercadoPago payment create failed:", err);
    for (const entry of reserved) {
      await incrementStock(entry.beerId, entry.qty);
    }
    return NextResponse.json(
      { error: "No pudimos procesar el pago. Probá de nuevo." },
      { status: 400 }
    );
  }

  if (payment.status !== "approved" || !payment.id) {
    for (const entry of reserved) {
      await incrementStock(entry.beerId, entry.qty);
    }
    return NextResponse.json({ error: paymentRejectionMessage(payment.status_detail) }, { status: 402 });
  }

  await connectDB();
  const order = await Order.create({
    userId: session.user.id,
    items: resolvedItems,
    shipping,
    subtotal,
    shippingCost,
    total,
    paymentId: String(payment.id),
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
