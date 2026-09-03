import { Beer, Truck, PackageSearch, Star, type LucideIcon } from "lucide-react";

const services: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Beer,
    title: "World Beers",
    description:
      "Cervezas importadas de todo el mundo. Rubias, rojas, doradas, negras. Para todo gusto.",
  },
  {
    icon: Truck,
    title: "Envíos a Domicilio",
    description:
      "Te llevamos las cervezas que quieras a donde quieras, para que no te falte nunca una birra.",
  },
  {
    icon: PackageSearch,
    title: "Seguí tu Pedido",
    description:
      "Mirá el estado de tu compra en tiempo real, desde confirmado hasta entregado en tu puerta.",
  },
  {
    icon: Star,
    title: "Reseñas Reales",
    description:
      "Opiniones y calificaciones de otros clientes en cada cerveza, para que elijas con confianza.",
  },
];

export function OurServices() {
  return (
    <section className="bg-dark py-24 text-cream">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold">Nuestros Servicios</h2>
        <div className="mx-auto mt-2 h-0.75 w-40 bg-cream" />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-cream/10 bg-cream/5 p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-linear-to-br hover:from-orange hover:to-gold hover:shadow-orange/20"
            >
              <Icon
                className="mx-auto text-orange transition-transform duration-300 group-hover:scale-110 group-hover:text-dark"
                size={44}
                strokeWidth={1.75}
              />
              <h3 className="mt-4 text-lg font-semibold transition-colors group-hover:text-dark">
                {title}
              </h3>
              <p className="mt-2 text-sm text-cream/70 transition-colors group-hover:text-dark/80">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
