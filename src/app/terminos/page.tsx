import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de uso y compra en Beer House: envíos, pagos, devoluciones y venta responsable de bebidas alcohólicas.",
};

const sections = [
  {
    title: "1. Aceptación de los términos",
    body: "Al usar este sitio y realizar una compra en Beer House aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguno de sus puntos, te pedimos que no utilices el sitio.",
  },
  {
    title: "2. Venta de bebidas alcohólicas",
    body: "La venta de bebidas alcohólicas está restringida a mayores de 18 años. Nos reservamos el derecho de solicitar documento de identidad al momento de la entrega y de no completar el pedido si no se puede acreditar la edad mínima.",
  },
  {
    title: "3. Precios y medios de pago",
    body: "Los precios publicados incluyen impuestos vigentes y pueden actualizarse sin previo aviso. El pedido se confirma una vez acreditado el pago por los medios habilitados en el checkout.",
  },
  {
    title: "4. Envíos y entregas",
    body: "Los tiempos de entrega informados son estimados y pueden variar según la zona y la disponibilidad. Beer House no se responsabiliza por demoras ocasionadas por datos de envío incorrectos o incompletos.",
  },
  {
    title: "5. Devoluciones y cambios",
    body: "Si tu pedido llega incompleto, dañado o con un producto distinto al solicitado, contactanos dentro de las 48 horas de recibido para gestionar el cambio o reembolso correspondiente.",
  },
  {
    title: "6. Consumo responsable",
    body: "Beer House promueve el consumo responsable de alcohol. Evitá conducir luego de consumir bebidas alcohólicas y no compres en nombre de menores de edad.",
  },
  {
    title: "7. Modificaciones",
    body: "Estos términos pueden actualizarse periódicamente. Los cambios entran en vigencia desde su publicación en esta misma página.",
  },
];

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-xs font-semibold tracking-wide text-orange uppercase">
        Legal
      </p>
      <h1 className="mt-2 text-3xl font-bold">Términos y Condiciones</h1>
      <p className="mt-3 text-dark/60">
        Última actualización: septiembre de 2026.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {sections.map(({ title, body }) => (
          <section key={title}>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-dark/70">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
