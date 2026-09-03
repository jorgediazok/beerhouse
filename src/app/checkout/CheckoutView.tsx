"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { useCartStore, selectTotalPrice } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { getShippingCost } from "@/lib/shipping";
import { productImageSrc } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";

const checkoutSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  phone: z.string().min(6, "Teléfono inválido"),
  document: z.string().min(6, "Documento inválido"),
  address: z.string().min(4, "Ingresá tu dirección"),
  zipCode: z.string().min(3, "Código postal inválido"),
  time: z.string().min(1, "Elegí un horario de entrega"),
  creditCardNumber: z.string().min(13, "Número de tarjeta inválido").max(19),
  date: z.string().min(1, "Fecha de vencimiento requerida"),
  code: z.string().min(3, "Código inválido").max(4),
});

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
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<{ id: string; total: number } | null>(null);
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const shippingCost = getShippingCost(totalPrice);
  const total = totalPrice + shippingCost;

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      document
        .querySelector(`[name="${String(result.error.issues[0].path[0])}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((entry) => ({
            beerId: entry.item.id,
            qty: entry.qty,
          })),
          shipping: {
            name: form.name,
            phone: form.phone,
            document: form.document,
            address: form.address,
            zipCode: form.zipCode,
            time: form.time,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "No se pudo confirmar el pedido");
      }

      const data: { orderId: string; total: number } = await response.json();
      clearCart();
      setOrder({ id: data.orderId, total: data.total });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No pudimos confirmar tu pedido. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
        <CheckCircle2 className="text-orange" size={56} />
        <h1 className="text-2xl font-bold">Compra Confirmada</h1>
        <p className="text-dark/60">
          Pedido <b className="text-dark">#{order.id.slice(-8).toUpperCase()}</b> por{" "}
          {formatPrice(order.total)}. Te enviamos un mail con el detalle. ¡Gracias por
          elegir Beer House!
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

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="text-dark/60">Agregá alguna cerveza antes de pasar por caja.</p>
        <Link
          href="/tienda"
          className="mt-4 rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
        >
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[75vh] max-w-7xl px-6 py-16 lg:px-10">
      <h1 className="text-3xl font-bold">Confirmar Compra</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_23rem] lg:gap-16">
        <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <Section title="Datos personales">
            <Field label="Nombre" name="name" value={form.name} onChange={updateForm} error={errors.name} />
            <Field label="Teléfono" name="phone" value={form.phone} onChange={updateForm} error={errors.phone} />
            <Field label="Documento" name="document" value={form.document} onChange={updateForm} error={errors.document} />
          </Section>

          <Section title="Envío">
            <Field label="Dirección" name="address" value={form.address} onChange={updateForm} error={errors.address} />
            <Field label="Código Postal" name="zipCode" value={form.zipCode} onChange={updateForm} error={errors.zipCode} />
            <Field
              label="Horario de Entrega"
              name="time"
              value={form.time}
              onChange={updateForm}
              error={errors.time}
              placeholder="Ej: 18:00 - 20:00"
            />
          </Section>

          <Section title="Pago">
            <Field
              label="Número de Tarjeta"
              name="creditCardNumber"
              value={form.creditCardNumber}
              onChange={updateForm}
              error={errors.creditCardNumber}
            />
            <Field label="Fecha de Vencimiento" name="date" type="date" value={form.date} onChange={updateForm} error={errors.date} />
            <Field label="Código (CVV)" name="code" value={form.code} onChange={updateForm} error={errors.code} />
          </Section>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-dark px-8 py-3.5 font-semibold text-cream transition hover:bg-orange hover:text-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Confirmando..." : `Pagar ${formatPrice(total)}`}
          </button>
        </div>

        <div className="h-fit rounded-2xl bg-dark p-7 text-cream">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <div className="mt-5 flex flex-col gap-3">
            {items.map((entry) => (
              <div key={entry.item.id} className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream/10">
                  <ProductImage
                    src={productImageSrc(entry.item.id)}
                    alt={entry.item.name}
                    fill
                    sizes="40px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{entry.item.name}</p>
                  <p className="text-xs text-cream/45">x{entry.qty}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(entry.item.price * entry.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-cream/15 pt-4">
            <div className="flex justify-between text-sm text-cream/55">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-cream/55">
              <span>Envío</span>
              <span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-cream/15 pt-3 text-lg font-bold">
              <span>Total</span>
              <span className="bg-linear-to-r from-orange to-gold bg-clip-text text-transparent">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-b border-dashed border-dark/10 py-6 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-3">
      <p className="col-span-full text-xs font-bold tracking-wide text-orange uppercase">{title}</p>
      {children}
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
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-dark/70">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange aria-invalid:border-red-400"
      />
      {error && (
        <span id={`${name}-error`} className="text-xs font-normal text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}
