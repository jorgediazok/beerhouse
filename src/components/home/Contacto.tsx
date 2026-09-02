"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MapPin, Phone, Mail } from "lucide-react";

const initialState = { name: "", email: "", message: "" };

export function Contacto() {
  const [form, setForm] = useState(initialState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setForm(initialState);
    toast.success("Mensaje enviado. Te contestamos a la brevedad. ¡Gracias!");
  };

  return (
    <section id="contacto" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-bold">Contactanos</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-dark/60">
        Hacenos tu consulta o pedido, te respondemos siempre lo más pronto
        posible.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 shrink-0 text-orange" />
            <div>
              <h3 className="font-semibold">Dirección</h3>
              <p className="text-sm text-dark/60">Talcahuano 1095, Buenos Aires.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-1 shrink-0 text-orange" />
            <div>
              <h3 className="font-semibold">Whatsapp</h3>
              <p className="text-sm text-dark/60">(011) 22334455</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-1 shrink-0 text-orange" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-dark/60">beerhouse@craftbeer.com</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            required
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-dark/10 bg-white px-4 py-3 outline-none focus:border-orange"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-dark/10 bg-white px-4 py-3 outline-none focus:border-orange"
          />
          <textarea
            required
            rows={4}
            placeholder="Mensaje"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-lg border border-dark/10 bg-white px-4 py-3 outline-none focus:border-orange"
          />
          <button
            type="submit"
            className="self-start rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
          >
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
