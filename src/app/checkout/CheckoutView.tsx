"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Info } from "lucide-react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { useCartStore, selectTotalPrice } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { getShippingCost } from "@/lib/shipping";
import { productImageSrc } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";

const shippingSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  phone: z.string().min(6, "Teléfono inválido"),
  document: z.string().min(6, "Documento inválido"),
  address: z.string().min(4, "Ingresá tu dirección"),
  zipCode: z.string().min(3, "Código postal inválido"),
  time: z.string().min(1, "Elegí un horario de entrega"),
});

const initialForm = {
  name: "",
  phone: "",
  document: "",
  address: "",
  zipCode: "",
  time: "",
};

type CardPaymentSubmit = NonNullable<React.ComponentProps<typeof CardPayment>["onSubmit"]>;

export function CheckoutView() {
  const { data: session } = useSession();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<{ id: string; total: number } | null>(null);
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const shippingCost = getShippingCost(totalPrice);
  const total = totalPrice + shippingCost;

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, { locale: "es-AR" });
  }, []);

  const email = session?.user?.email;
  // The Brick re-initializes (visibly flickers) whenever this object gets a
  // new reference, so it must stay stable across the re-renders every
  // keystroke in the shipping fields triggers — only rebuild it when the
  // values that actually feed the Brick change.
  const cardPaymentInitialization = useMemo(
    () => ({ amount: total, payer: email ? { email } : undefined }),
    [total, email]
  );

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePaymentSubmit: CardPaymentSubmit = async ({ token, issuer_id, payment_method_id, installments, payer }) => {
    const result = shippingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      document
        .querySelector(`[name="${String(result.error.issues[0].path[0])}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      throw new Error("Completá tus datos de envío antes de pagar");
    }
    setErrors({});

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((entry) => ({
            beerId: entry.item.id,
            qty: entry.qty,
          })),
          shipping: result.data,
          card: {
            token,
            issuer_id,
            payment_method_id,
            installments,
            payer: { email: payer.email ?? "", identification: payer.identification },
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "No pudimos procesar el pago");
      }

      clearCart();
      setOrder({ id: data.orderId, total: data.total });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No pudimos confirmar tu pedido. Probá de nuevo.");
      throw err;
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

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_23rem] lg:gap-16">
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

          <div className="border-b border-dashed border-dark/10 py-6 first:pt-0 last:border-b-0 last:pb-0">
            <p className="mb-4 text-xs font-bold tracking-wide text-orange uppercase">Pago</p>

            <div className="mb-5 flex gap-3 rounded-xl border border-orange/20 bg-orange/5 p-4 text-sm">
              <Info className="mt-0.5 shrink-0 text-orange" size={18} aria-hidden="true" />
              <div className="text-dark/70">
                <p className="font-semibold text-dark">Este es un checkout de demostración</p>
                <p className="mt-1">
                  Los pagos corren en modo de prueba de Mercado Pago — no se realiza ningún cobro
                  real. Usá estos datos para completar la compra:
                </p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-xs text-dark/80">
                  <dt className="text-dark/50">Tarjeta</dt>
                  <dd>4509 9535 6623 3704</dd>
                  <dt className="text-dark/50">Vencimiento</dt>
                  <dd>11/30</dd>
                  <dt className="text-dark/50">CVV</dt>
                  <dd>123</dd>
                  <dt className="text-dark/50">Titular</dt>
                  <dd>APRO</dd>
                  <dt className="text-dark/50">Documento</dt>
                  <dd>12345678</dd>
                </dl>
              </div>
            </div>

            <CardPayment
              initialization={cardPaymentInitialization}
              onSubmit={handlePaymentSubmit}
              onError={(error) => {
                console.error(error);
                toast.error("No pudimos cargar el formulario de pago. Recargá la página.");
              }}
              locale="es-AR"
            />
          </div>
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
      </div>
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
