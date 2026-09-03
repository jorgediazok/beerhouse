import type { Beer } from "@/types/beer";
import { OFERTAS } from "@/lib/ofertas";
import { OfertasRail } from "@/components/home/OfertasRail";

export function Ofertas({ beers }: { beers: Beer[] }) {
  const featured = OFERTAS.map((oferta) => {
    const beer = beers.find((b) => b.id === oferta.beerId);
    return beer ? { beer, oferta } : null;
  }).filter((entry) => entry !== null);

  return (
    <section id="ofertas" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold">Cervezas En Oferta</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-dark/60">
          Seleccionadas entre nuestro catálogo de cervezas importadas y
          artesanales, bajo estrictos estándares de calidad. No te pierdas las
          mejores ofertas de la temporada.
        </p>

        {featured.length === 0 ? (
          <p className="mt-10 text-center text-dark/50">
            No hay cervezas disponibles en este momento.
          </p>
        ) : (
          <OfertasRail items={featured} />
        )}
      </div>
    </section>
  );
}
