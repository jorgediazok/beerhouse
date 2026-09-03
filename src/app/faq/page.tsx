import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description:
    "Respuestas a las preguntas más frecuentes sobre envíos, pagos, pedidos y venta de bebidas alcohólicas en Beer House.",
};

const faqs = [
  {
    question: "¿Cuánto tarda el envío?",
    answer:
      "Entregamos en el día dentro de Buenos Aires. En pedidos realizados fuera de nuestro horario de atención, se despachan al día hábil siguiente.",
  },
  {
    question: "¿Cuáles son los medios de pago disponibles?",
    answer:
      "Podés pagar con tarjeta de débito o crédito al finalizar la compra desde el checkout online.",
  },
  {
    question: "¿Hay un pedido mínimo?",
    answer:
      "No, podés pedir la cantidad que necesites. Para pedidos grandes o eventos, escribinos por Whatsapp y coordinamos un envío especial.",
  },
  {
    question: "¿Piden documento para comprar alcohol?",
    answer:
      "Sí. La venta de bebidas alcohólicas es exclusiva para mayores de 18 años y podemos solicitar tu documento en el momento de la entrega.",
  },
  {
    question: "¿Puedo modificar o cancelar mi pedido?",
    answer:
      "Mientras el pedido no haya salido a entrega, podés modificarlo o cancelarlo contactándonos por teléfono o email lo antes posible.",
  },
  {
    question: "¿En qué zonas hacen envíos?",
    answer:
      "Cubrimos toda la Ciudad de Buenos Aires. Si estás fuera de esta zona, escribinos y te confirmamos si podemos llegar hasta vos.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-xs font-semibold tracking-wide text-orange uppercase">
        Ayuda
      </p>
      <h1 className="mt-2 text-3xl font-bold">Preguntas Frecuentes</h1>
      <p className="mt-3 text-dark/60">
        Si no encontrás la respuesta que buscás, escribinos desde la sección
        de contacto.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {faqs.map(({ question, answer }) => (
          <section key={question}>
            <h2 className="text-lg font-semibold">{question}</h2>
            <p className="mt-2 text-dark/70">{answer}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
