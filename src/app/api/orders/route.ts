import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getShippingCost } from "@/lib/shipping";

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        beerId: z.string().min(1),
        name: z.string().min(1),
        price: z.number().positive(),
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
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost = getShippingCost(subtotal);
  const total = subtotal + shippingCost;

  await connectDB();
  const order = await Order.create({
    userId: session.user.id,
    items,
    shipping,
    subtotal,
    shippingCost,
    total,
  });

  return NextResponse.json({ orderId: order._id.toString(), total }, { status: 201 });
}
