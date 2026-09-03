"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";

const emailSchema = z.string().email("Email inválido");

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(undefined);

    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: { devResetUrl?: string } = await response.json();
      setDevResetUrl(data.devResetUrl ?? null);
      setSent(true);
    } catch {
      toast.error("Algo salió mal. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="rounded-2xl border border-dark/5 bg-white p-8 shadow-[0_25px_60px_rgba(0,0,0,0.15)] sm:p-10">
        {sent ? (
          <>
            <h1 className="text-xl font-bold">Revisá tu email</h1>
            <p className="mt-2 text-sm text-dark/55">
              Si existe una cuenta con ese email, te enviamos instrucciones para
              restablecer tu contraseña.
            </p>
            {devResetUrl && (
              <div className="mt-5 rounded-lg border border-dashed border-orange/40 bg-orange/5 p-4 text-sm">
                <p className="font-semibold text-dark">Modo desarrollo</p>
                <p className="mt-1 text-dark/60">
                  Todavía no conectamos un servicio de email real, así que por
                  ahora te dejamos el link acá:
                </p>
                <Link href={devResetUrl} className="mt-2 block truncate text-orange underline">
                  {devResetUrl}
                </Link>
              </div>
            )}
            <Link
              href="/login"
              className="mt-6 inline-block text-sm text-dark/55 underline hover:text-orange"
            >
              Volver al login
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">Recuperar contraseña</h1>
            <p className="mt-1 text-sm text-dark/55">
              Ingresá tu email y te mandamos instrucciones para elegir una nueva.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 text-left">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-dark/70">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange"
                />
                {error && <span className="text-xs font-normal text-red-500">{error}</span>}
              </label>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-full bg-dark px-8 py-3.5 font-semibold text-cream transition hover:bg-orange hover:text-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </button>
              <Link
                href="/login"
                className="text-center text-sm text-dark/55 underline hover:text-orange"
              >
                Volver al login
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
