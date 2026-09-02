import { UserRound } from "lucide-react";

const testimonials = [
  {
    name: "Julián Ferreyra",
    profession: "Fotógrafo",
    text: "Pedí varias veces para juntadas con amigos y siempre llegó rápido y bien frío. La variedad de cervezas importadas es lo que más me gusta.",
  },
  {
    name: "Camila Roldán",
    profession: "Diseñadora",
    text: "Excelente atención y los envíos son puntuales. Encontré marcas que no conseguía en ningún otro lado de Buenos Aires.",
  },
  {
    name: "Tomás Ibarra",
    profession: "Chef",
    text: "Uso Beer House para maridar mis eventos. La calidad es constante y el catálogo se renueva seguido con novedades.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold">Clientes Que Nos Eligen</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {testimonials.map(({ name, profession, text }) => (
            <div
              key={name}
              className="flex flex-col gap-4 rounded-xl bg-white p-6 text-center shadow-sm"
            >
              <p className="text-sm text-dark/70 italic">&ldquo;{text}&rdquo;</p>
              <div className="mt-auto flex flex-col items-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange/15 text-orange">
                  <UserRound size={24} />
                </span>
                <h3 className="text-sm font-semibold">
                  {name}
                  <span className="block font-normal text-dark/50">{profession}</span>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
