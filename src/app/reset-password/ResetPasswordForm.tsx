"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/PasswordInput";

const resetSchema = z
  .object({
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const initialForm = { password: "", confirmPassword: "" };

export function ResetPasswordForm({ token }: { token?: string }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <Card>
        <h1 className="text-xl font-bold">Link inválido</h1>
        <p className="mt-2 text-sm text-dark/55">
          Este link de recuperación no es válido. Pedí uno nuevo.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
        >
          Recuperar contraseña
        </Link>
      </Card>
    );
  }

  if (done) {
    return (
      <Card>
        <h1 className="text-xl font-bold">Contraseña actualizada</h1>
        <p className="mt-2 text-sm text-dark/55">Ya podés ingresar con tu nueva contraseña.</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
        >
          Ir al login
        </Link>
      </Card>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = resetSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "No pudimos restablecer tu contraseña");
      }

      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No pudimos restablecer tu contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h1 className="text-xl font-bold">Elegí una nueva contraseña</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-dark/70">
          Nueva contraseña
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            autoFocus
            className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange"
          />
          {errors.password && <span className="text-xs font-normal text-red-500">{errors.password}</span>}
        </label>
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
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-full bg-dark px-8 py-3.5 font-semibold text-cream transition hover:bg-orange hover:text-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-dark/5 bg-white p-8 shadow-[0_25px_60px_rgba(0,0,0,0.15)] sm:p-10">
        {children}
      </div>
    </div>
  );
}
