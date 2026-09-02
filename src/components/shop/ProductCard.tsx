import Image from "next/image";
import Link from "next/link";
import type { Beer } from "@/types/beer";

export function ProductCard({ beer }: { beer: Beer }) {
  return (
    <Link
      href={`/tienda/${beer.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative h-48 w-full bg-cream">
        {beer.imageUrl && (
          <Image
            src={beer.imageUrl}
            alt={beer.name}
            fill
            className="object-contain p-6 transition group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="font-semibold">{beer.name}</h3>
        <span className="font-bold text-orange">$ {beer.price}</span>
        <p className="line-clamp-2 text-sm text-dark/60">{beer.description}</p>
      </div>
      <div className="border-t border-dark/5 p-4 text-center">
        <span className="inline-block rounded-full bg-dark px-6 py-2 text-sm font-semibold text-cream transition group-hover:bg-orange group-hover:text-dark">
          DETALLES
        </span>
      </div>
    </Link>
  );
}
