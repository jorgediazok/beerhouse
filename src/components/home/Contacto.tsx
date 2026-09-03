"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MapPin, Phone, Mail } from "lucide-react";

const initialState = { name: "", email: "", message: "", website: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(form: typeof initialState): Errors {
  const errors: Errors = {};

  if (!form.name.trim()) errors.name = "Ingresá tu nombre.";
  else if (form.name.length > 100) errors.name = "Máximo 100 caracteres.";

  if (!form.email.trim()) errors.email = "Ingresá tu email.";
  else if (!EMAIL_RE.test(form.email)) errors.email = "Ingresá un email válido.";
  else if (form.email.length > 200) errors.email = "Máximo 200 caracteres.";

  if (!form.message.trim()) errors.message = "Contanos qué necesitás.";
  else if (form.message.length > 5000) errors.message = "Máximo 5000 caracteres.";

  return errors;
}

export function Contacto() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setForm(initialState);
      toast.success("Mensaje enviado. Te contestamos a la brevedad. ¡Gracias!");
    } catch {
      toast.error("No pudimos enviar tu mensaje. Probá de nuevo en un rato.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="relative grid overflow-hidden bg-cream sm:grid-cols-[41%_59%]">
      <div className="relative flex flex-col justify-center bg-dark px-6 pt-20 pb-28 text-cream sm:pt-28 sm:pb-36 sm:pl-12 sm:pr-6 lg:pl-24 lg:pr-4 xl:pl-28 xl:pr-6 sm:[clip-path:polygon(0_0,100%_0,88%_100%,0%_100%)]">
        <p className="text-xs font-semibold tracking-wide text-gold uppercase">
          Hablemos
        </p>
        <h2 className="mt-3 max-w-lg bg-linear-to-r from-orange to-gold bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
          Pedí tu birra, contanos qué necesitás
        </h2>
        <p className="mt-4 max-w-104 text-cream/60">
          Consultas, pedidos grandes o alianzas: te contestamos siempre lo más
          pronto posible.
        </p>

        <div className="mt-12 flex flex-col gap-7">
          <div className="flex items-start gap-4">
            <MapPin className="mt-0.5 shrink-0 text-orange" size={22} />
            <div>
              <p className="text-xs font-semibold tracking-wide text-cream/40 uppercase">
                Dirección
              </p>
              <p className="text-lg">Talcahuano 1095, Buenos Aires</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="mt-0.5 shrink-0 text-orange" size={22} />
            <div>
              <p className="text-xs font-semibold tracking-wide text-cream/40 uppercase">
                Whatsapp
              </p>
              <p className="text-lg">(011) 22334455</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="mt-0.5 shrink-0 text-orange" size={22} />
            <div>
              <p className="text-xs font-semibold tracking-wide text-cream/40 uppercase">
                Email
              </p>
              <p className="text-lg">beerhouse@craftbeer.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center px-6 pt-16 pb-24 sm:px-10 sm:pt-28 sm:pb-36">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full rounded-2xl border border-dark/5 bg-white p-8 shadow-[0_25px_60px_rgba(0,0,0,0.15)] sm:-ml-16 sm:p-10"
        >
          <h3 className="text-lg font-bold text-dark">Escribinos</h3>
          <div className="mt-6 flex flex-col gap-5">
            <label
              htmlFor="contact-website"
              className="absolute -left-full opacity-0"
              aria-hidden="true"
            >
              No completar
              <input
                id="contact-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </label>
            <label
              htmlFor="contact-name"
              className="flex flex-col gap-1.5 text-sm font-medium text-dark/70"
            >
              Nombre
              <input
                id="contact-name"
                type="text"
                required
                maxLength={100}
                placeholder="Tu nombre"
                value={form.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange aria-invalid:border-red-400"
              />
              {errors.name && (
                <span id="contact-name-error" className="text-xs font-normal text-red-500">
                  {errors.name}
                </span>
              )}
            </label>
            <label
              htmlFor="contact-email"
              className="flex flex-col gap-1.5 text-sm font-medium text-dark/70"
            >
              Email
              <input
                id="contact-email"
                type="email"
                required
                maxLength={200}
                placeholder="tu@email.com"
                value={form.email}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange aria-invalid:border-red-400"
              />
              {errors.email && (
                <span id="contact-email-error" className="text-xs font-normal text-red-500">
                  {errors.email}
                </span>
              )}
            </label>
            <label
              htmlFor="contact-message"
              className="flex flex-col gap-1.5 text-sm font-medium text-dark/70"
            >
              Mensaje
              <textarea
                id="contact-message"
                required
                rows={3}
                maxLength={5000}
                placeholder="Contanos qué necesitás"
                value={form.message}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: undefined });
                }}
                className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange aria-invalid:border-red-400"
              />
              {errors.message && (
                <span id="contact-message-error" className="text-xs font-normal text-red-500">
                  {errors.message}
                </span>
              )}
            </label>
            <button
              type="submit"
              disabled={sending}
              className="mt-1 rounded-full bg-dark px-8 py-3.5 font-semibold text-cream transition hover:bg-orange hover:text-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
