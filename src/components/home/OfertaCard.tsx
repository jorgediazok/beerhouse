import Image from "next/image";
import Link from "next/link";
import type { Beer } from "@/types/beer";
import type { OfertaOverride } from "@/lib/ofertas";

const priceFormatter = new Intl.NumberFormat("es-CL", {
  maximumFractionDigits: 0,
});

export function OfertaCard({
  beer,
  oferta,
}: {
  beer: Beer;
  oferta: OfertaOverride;
}) {
  const originalPrice = Math.round(
    beer.price / (1 - oferta.discountPercent / 100)
  );

  return (
    <Link
      href={`/tienda/${beer.id}`}
      className="group flex w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-dark/8 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative h-40 w-full bg-cream">
        <span className="absolute top-2 left-2 z-10 rounded-md bg-orange px-2 py-0.5 font-mono text-[11px] font-bold text-white">
          -{oferta.discountPercent}%
        </span>
        <Image
          src={oferta.cutoutSrc}
          alt={beer.name}
          fill
          className="object-contain p-4 transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold">{beer.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-orange">
            $ {priceFormatter.format(beer.price)}
          </span>
          <span className="text-xs text-dark/40 line-through">
            $ {priceFormatter.format(originalPrice)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-dark/60">{beer.description}</p>
      </div>
    </Link>
  );
}
