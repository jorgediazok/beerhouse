import { Beer, Truck, Gift, IdCard, type LucideIcon } from "lucide-react";

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
    icon: Gift,
    title: "Regalá Cerveza",
    description:
      "¿Tenés un cumpleaños y no sabés qué regalar? Consultá nuestros packs especiales de regalos.",
  },
  {
    icon: IdCard,
    title: "Hacete Miembro",
    description:
      "Asociate al Club Beer House y recibí novedades, descuentos y participá de sorteos.",
  },
];

export function OurServices() {
  return (
    <section className="bg-dark py-20 text-cream">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold">Nuestros Servicios</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 rounded-xl bg-cream/5 p-6 text-center"
            >
              <Icon className="text-orange" size={32} />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-cream/70">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
