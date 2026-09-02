"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { useCartStore, selectTotalPrice } from "@/store/cart-store";

const stepSchemas = [
  z.object({
    name: z.string().min(2, "Ingresá tu nombre"),
    phone: z.string().min(6, "Teléfono inválido"),
    document: z.string().min(6, "Documento inválido"),
  }),
  z.object({
    address: z.string().min(4, "Ingresá tu dirección"),
    zipCode: z.string().min(3, "Código postal inválido"),
    time: z.string().min(1, "Elegí un horario de entrega"),
  }),
  z.object({
    creditCardNumber: z.string().min(13, "Número de tarjeta inválido").max(19),
    date: z.string().min(1, "Fecha de vencimiento requerida"),
    code: z.string().min(3, "Código inválido").max(4),
  }),
];

const initialForm = {
  name: "",
  phone: "",
  document: "",
  address: "",
  zipCode: "",
  time: "",
  creditCardNumber: "",
  date: "",
  code: "",
};

export function CheckoutView() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep = () => {
    const result = stepSchemas[step - 1].safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    clearCart();
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
        <CheckCircle2 className="text-orange" size={56} />
        <h1 className="text-2xl font-bold">Compra Confirmada</h1>
        <p className="text-dark/60">
          Te enviamos un mail con el detalle de tu orden. ¡Gracias por elegir
          Beer House!
        </p>
        <Link
          href="/"
          className="mt-4 rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-center text-2xl font-bold">Confirmar Compra</h1>
      <p className="mt-2 text-center text-dark/60">Paso {step} de 3</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {step === 1 && (
          <>
            <Field label="Nombre" name="name" value={form.name} onChange={updateForm} error={errors.name} />
            <Field label="Teléfono" name="phone" value={form.phone} onChange={updateForm} error={errors.phone} />
            <Field label="Documento" name="document" value={form.document} onChange={updateForm} error={errors.document} />
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Dirección" name="address" value={form.address} onChange={updateForm} error={errors.address} />
            <Field label="Código Postal" name="zipCode" value={form.zipCode} onChange={updateForm} error={errors.zipCode} />
            <Field label="Horario de Entrega" name="time" value={form.time} onChange={updateForm} error={errors.time} />
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className="text-center font-semibold underline">Tu Compra</h2>
              {items.map((entry) => (
                <p key={entry.item.id} className="mt-2 text-center text-sm">
                  {entry.item.name} x {entry.qty} unidades 🍺
                </p>
              ))}
              <p className="mt-3 text-center">
                Total a Pagar: <b>$ {totalPrice}</b>
              </p>
            </div>
            <Field
              label="Número de Tarjeta"
              name="creditCardNumber"
              value={form.creditCardNumber}
              onChange={updateForm}
              error={errors.creditCardNumber}
            />
            <Field label="Fecha de Vencimiento" name="date" type="date" value={form.date} onChange={updateForm} error={errors.date} />
            <Field label="Código (CVV)" name="code" value={form.code} onChange={updateForm} error={errors.code} />
          </>
        )}

        <div className="mt-4 flex justify-between gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-full border border-dark/20 px-6 py-3 font-semibold transition hover:bg-dark/5"
            >
              Volver
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-full bg-orange px-6 py-3 font-semibold text-dark transition hover:bg-gold"
            >
              Continuar
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 rounded-full bg-orange px-6 py-3 font-semibold text-dark transition hover:bg-gold"
            >
              Pagar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-dark/10 bg-white px-4 py-3 outline-none focus:border-orange"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
