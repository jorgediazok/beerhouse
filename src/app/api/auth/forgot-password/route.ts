import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { generateResetToken } from "@/lib/resetToken";
import { sendEmail } from "@/lib/email";
import { isRateLimited, getRequestIp } from "@/lib/rateLimit";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (isRateLimited(getRequestIp(request), 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Probá de nuevo más tarde." },
      { status: 429 }
    );
  }

  const email = parsed.data.email.toLowerCase();

  await connectDB();
  const user = await User.findOne({ email });

  if (user) {
    const { token, tokenHash, expiresAt } = generateResetToken();
    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = expiresAt;
    await user.save();

    const resetUrl = new URL("/reset-password", request.url);
    resetUrl.searchParams.set("token", token);

    await sendEmail({
      to: user.email,
      subject: "Recuperá tu contraseña — Beer House",
      text: `Alguien solicitó restablecer la contraseña de tu cuenta en Beer House.\n\nSi fuiste vos, entrá a este link para elegir una nueva contraseña (válido por 1 hora):\n${resetUrl.toString()}\n\nSi no fuiste vos, podés ignorar este mensaje.`,
    });
  }

  // Same response whether or not the account exists, so this endpoint
  // can't be used to enumerate registered emails.
  return NextResponse.json({ success: true });
}
