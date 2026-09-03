import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Missing RESEND_API_KEY — skipping email send");
    return { error: new Error("Missing RESEND_API_KEY") };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Beer House <onboarding@resend.dev>",
    to,
    subject,
    text,
    replyTo,
  });

  if (error) {
    console.error("Failed to send email:", error);
  }

  return { error };
}
