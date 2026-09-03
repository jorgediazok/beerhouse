import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { generateResetToken } from "@/lib/resetToken";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  await connectDB();
  const user = await User.findOne({ email });

  if (!user) {
    // Same response whether or not the account exists, so this endpoint
    // can't be used to enumerate registered emails.
    return NextResponse.json({ success: true });
  }

  const { token, tokenHash, expiresAt } = generateResetToken();
  user.resetTokenHash = tokenHash;
  user.resetTokenExpiresAt = expiresAt;
  await user.save();

  const resetUrl = new URL("/reset-password", request.url);
  resetUrl.searchParams.set("token", token);

  // No email service is wired up yet — surface the link directly so the
  // flow is fully testable. Once real email sending exists, stop returning
  // this and send the link instead.
  return NextResponse.json({ success: true, devResetUrl: resetUrl.toString() });
}
