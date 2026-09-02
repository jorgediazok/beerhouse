import type { Beer } from "@/types/beer";
import { OfertaCard } from "@/components/home/OfertaCard";

export function Ofertas({ beers }: { beers: Beer[] }) {
  const featured = beers.slice(0, 5);

  return (
    <section id="ofertas" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-bold">Cervezas En Oferta</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-dark/60">
        Importadas desde los países con más tradición cervecera y bajo estrictos
        estándares de calidad. No te pierdas las mejores ofertas de la temporada.
      </p>

      {featured.length === 0 ? (
        <p className="mt-10 text-center text-dark/50">
          No hay cervezas disponibles en este momento.
        </p>
      ) : (
        <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
          {featured.map((beer) => (
            <OfertaCard key={beer.id} beer={beer} />
          ))}
        </div>
      )}
    </section>
  );
}
