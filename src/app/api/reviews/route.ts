import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getBeerById } from "@/lib/contentful";
import { upsertReview } from "@/lib/reviews";

const reviewSchema = z.object({
  beerId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(1000),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { beerId, name, rating, comment } = parsed.data;

  const beer = await getBeerById(beerId);
  if (!beer) {
    return NextResponse.json(
      { error: "Este producto ya no está disponible" },
      { status: 400 }
    );
  }

  await upsertReview({ userId: session.user.id, beerId, name, rating, comment });

  return NextResponse.json({ ok: true }, { status: 201 });
}
