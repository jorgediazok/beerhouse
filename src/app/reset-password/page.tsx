import type { Metadata } from "next";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  description: "Elegí una nueva contraseña para tu cuenta de Beer House.",
  robots: { index: false, follow: true },
};

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;

  return <ResetPasswordForm token={typeof token === "string" ? token : undefined} />;
}
