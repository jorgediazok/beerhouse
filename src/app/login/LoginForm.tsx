"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";
import { Truck, Globe, ShieldCheck } from "lucide-react";
import { Bubbles } from "@/components/ui/Bubbles";
import { PasswordInput } from "@/components/ui/PasswordInput";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signupSchema = loginSchema
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const initialState = { email: "", password: "", confirmPassword: "" };

const trustPoints = [
  { icon: Truck, title: "Envío en 24 horas", desc: "a todo el país" },
  { icon: Globe, title: "Catálogo internacional", desc: "de cervecerías" },
  { icon: ShieldCheck, title: "Pago 100% seguro", desc: "en el checkout" },
];

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const redirectTo =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/tienda";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = () => {
    setForm(initialState);
    setErrors({});
    setIsSignup((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const schema = isSignup ? signupSchema : loginSchema;
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    if (isSignup) {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.error === "Email already registered" ? "El email ya está registrado" : "No pudimos crear tu cuenta");
        setLoading(false);
        return;
      }
    }

    const signInResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      toast.error("Credenciales inválidas");
      return;
    }

    toast.success("Te logueaste correctamente");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="grid min-h-[75vh] flex-1 overflow-hidden bg-cream sm:grid-cols-[42%_58%]">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-dark px-10 py-16 text-cream sm:flex sm:[clip-path:polygon(0_0,100%_0,88%_100%,0%_100%)] lg:pl-16 lg:pr-10">
        <Bubbles />
        <div className="relative w-full max-w-xs">
          <h1 className="bg-linear-to-r from-orange to-gold bg-clip-text text-3xl font-extrabold text-transparent">
            Tu birra favorita, a un login de distancia
          </h1>
          <p className="mt-4 text-cream/60">
            Entrá para ver tus pedidos, guardar direcciones y pedir más rápido la próxima vez.
          </p>
          <div className="mt-10 flex flex-col gap-6">
            {trustPoints.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon className="shrink-0 text-orange" size={19} aria-hidden="true" />
                <div className="text-sm">
                  <p className="font-semibold">{title}</p>
                  <p className="text-cream/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="w-full max-w-md rounded-2xl border border-dark/5 bg-white p-8 shadow-[0_25px_60px_rgba(0,0,0,0.15)] sm:p-10">
          <h2 className="text-xl font-bold">Bienvenido de nuevo</h2>
          <p className="mt-1 text-sm text-dark/55">Ingresá para seguir con tu pedido.</p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-dark/70">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoFocus
                className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange"
              />
              {errors.email && <span className="text-xs font-normal text-red-500">{errors.email}</span>}
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-dark/70">
              Contraseña
              <PasswordInput
                name="password"
                value={form.password}
                onChange={handleChange}
                className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange"
              />
              {errors.password && <span className="text-xs font-normal text-red-500">{errors.password}</span>}
            </label>
            {!isSignup && (
              <Link
                href="/forgot-password"
                className="-mt-2 text-left text-sm text-dark/55 underline hover:text-orange"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            )}
            {isSignup && (
              <label className="flex flex-col gap-1.5 text-sm font-medium text-dark/70">
                Confirmar contraseña
                <PasswordInput
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange"
                />
                {errors.confirmPassword && (
                  <span className="text-xs font-normal text-red-500">{errors.confirmPassword}</span>
                )}
              </label>
            )}

            <button
              type="button"
              onClick={switchMode}
              className="text-left text-sm text-dark/55 underline hover:text-orange"
            >
              {isSignup ? "¿Ya tenés una cuenta? Logueate" : "¿No tenés una cuenta? Registrate"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-full bg-dark px-8 py-3.5 font-semibold text-cream transition hover:bg-orange hover:text-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSignup ? "Registrarse" : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
