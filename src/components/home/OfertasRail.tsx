import type { Beer } from "@/types/beer";
import type { OfertaOverride } from "@/lib/ofertas";
import { OfertaCard } from "@/components/home/OfertaCard";
import { ProductRail } from "@/components/shop/ProductRail";

export function OfertasRail({
  items,
}: {
  items: { beer: Beer; oferta: OfertaOverride }[];
}) {
  return (
    <div className="mt-10">
      <ProductRail itemLabel="oferta" arrowTopClassName="top-20">
        {items.map(({ beer, oferta }) => (
          <OfertaCard key={beer.id} beer={beer} oferta={oferta} />
        ))}
      </ProductRail>
    </div>
  );
}
