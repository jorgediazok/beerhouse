"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

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

export function LoginForm() {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    router.push("/tienda");
    router.refresh();
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
      <Image
        src="/images/login.jpg"
        alt="Beer House"
        width={490}
        height={490}
        className="hidden w-full rounded-xl object-cover shadow-md lg:block"
      />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Logueate y Pedí tus cervezas</h1>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 text-left">
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoFocus
              className="rounded-lg border border-dark/10 bg-white px-4 py-3 outline-none focus:border-orange"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="rounded-lg border border-dark/10 bg-white px-4 py-3 outline-none focus:border-orange"
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
          </label>
          {isSignup && (
            <label className="flex flex-col gap-1 text-sm">
              Confirmar Password
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="rounded-lg border border-dark/10 bg-white px-4 py-3 outline-none focus:border-orange"
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-500">{errors.confirmPassword}</span>
              )}
            </label>
          )}

          <button
            type="button"
            onClick={switchMode}
            className="text-sm text-dark/60 underline hover:text-orange"
          >
            {isSignup ? "¿Ya tenés una cuenta? Logueate" : "¿No tenés una cuenta? Registrate"}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold disabled:opacity-60"
          >
            {isSignup ? "Registrarse" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
