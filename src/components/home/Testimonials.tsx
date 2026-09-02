import Image from "next/image";
import { Quote } from "lucide-react";
import { Bubbles } from "@/components/ui/Bubbles";

const testimonials = [
  {
    name: "Julián Ferreyra",
    profession: "Fotógrafo",
    text: "Pedí varias veces para juntadas con amigos y siempre llegó rápido y bien frío. La variedad de cervezas importadas es lo que más me gusta.",
    photo: "/images/testimonials/testimonial-1.jpg",
    from: "from-gold",
    to: "to-gold/70",
  },
  {
    name: "Camila Roldán",
    profession: "Diseñadora",
    text: "Excelente atención y los envíos son puntuales. Encontré marcas que no conseguía en ningún otro lado de Buenos Aires.",
    photo: "/images/testimonials/testimonial-2.jpg",
    from: "from-orange",
    to: "to-orange/70",
  },
  {
    name: "Tomás Ibarra",
    profession: "Chef",
    text: "Uso Beer House para maridar mis eventos. La calidad es constante y el catálogo se renueva seguido con novedades.",
    photo: "/images/testimonials/testimonial-3.jpg",
    from: "from-dark",
    to: "to-dark/60",
  },
];

export function Testimonials() {
  return (
    <section className="bg-dark py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-cream">
          Clientes Que Nos Eligen
        </h2>
        <div className="mx-auto mt-2 h-0.75 w-40 bg-cream" />

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {testimonials.map(({ name, profession, text, photo, from, to }, i) => (
            <div
              key={name}
              className={`relative flex flex-col items-center overflow-hidden rounded-2xl border-2 border-cream/80 bg-linear-to-br ${from} ${to} px-6 pt-14 pb-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-2 ${
                i % 2 === 0 ? "sm:rotate-1" : "sm:-rotate-1"
              } hover:rotate-0`}
            >
              <Bubbles />
              <Quote
                className="absolute top-3 left-1/2 z-10 -translate-x-1/2 text-cream/40"
                size={56}
                strokeWidth={1.5}
              />
              <p className="relative z-10 mt-4 text-sm text-cream">&ldquo;{text}&rdquo;</p>
              <span className="relative z-10 mt-6 block h-16 w-16 overflow-hidden rounded-full border-4 border-cream">
                <Image
                  src={photo}
                  alt={name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </span>
              <h3 className="relative z-10 mt-3 text-base font-semibold text-cream">
                {name}
                <span className="block text-sm font-normal text-cream/70">
                  {profession}
                </span>
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
