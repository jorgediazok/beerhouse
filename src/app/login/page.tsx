import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Ingresá a tu cuenta de Beer House o registrate para empezar a comprar.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { callbackUrl } = await searchParams;

  return (
    <LoginForm callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined} />
  );
}
