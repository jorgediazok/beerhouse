import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { isRateLimited, getRequestIp } from "@/lib/rateLimit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { name, email, message, website } = await request.json();

  // Honeypot: real visitors never see or fill this field, only bots do.
  if (typeof website === "string" && website.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim() ||
    name.length > 100 ||
    email.length > 200 ||
    message.length > 5000 ||
    !EMAIL_RE.test(email)
  ) {
    return NextResponse.json(
      { error: "Revisá los datos del formulario." },
      { status: 400 }
    );
  }

  if (isRateLimited(getRequestIp(request), 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Demasiados mensajes. Probá de nuevo más tarde." },
      { status: 429 }
    );
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return NextResponse.json(
      { error: "El envío de mensajes no está configurado." },
      { status: 503 }
    );
  }

  const { error } = await sendEmail({
    to,
    replyTo: email,
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: `De: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
