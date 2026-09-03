import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  hits.push(now);
  requestLog.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

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

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiados mensajes. Probá de nuevo más tarde." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;

  if (!apiKey || !to) {
    return NextResponse.json(
      { error: "El envío de mensajes no está configurado." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Beer House <onboarding@resend.dev>",
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
