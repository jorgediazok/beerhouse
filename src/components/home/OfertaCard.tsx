import Image from "next/image";
import Link from "next/link";
import type { Beer } from "@/types/beer";

export function OfertaCard({ beer }: { beer: Beer }) {
  return (
    <Link
      href={`/tienda/${beer.id}`}
      className="group flex w-56 shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative h-40 w-full bg-cream">
        {beer.imageUrl && (
          <Image
            src={beer.imageUrl}
            alt={beer.name}
            fill
            className="object-contain p-4 transition group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold">{beer.name}</h3>
        <span className="font-bold text-orange">$ {beer.price}</span>
        <p className="line-clamp-2 text-sm text-dark/60">{beer.description}</p>
      </div>
    </Link>
  );
}
