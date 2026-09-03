import Link from "next/link";
import type { Beer } from "@/types/beer";
import { formatPrice } from "@/lib/format";
import { productImageSrc } from "@/lib/images";
import { ProductImage } from "@/components/ui/ProductImage";

export function ProductCard({ beer, stock }: { beer: Beer; stock?: number }) {
  const outOfStock = stock === 0;

  return (
    <Link
      href={`/tienda/${beer.id}`}
      className={`group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg ${
        outOfStock ? "opacity-70" : ""
      }`}
    >
      <div className="relative h-48 w-full bg-cream">
        {outOfStock && (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-dark/80 px-2 py-1 text-xs font-bold text-cream">
            Sin stock
          </span>
        )}
        <ProductImage
          src={productImageSrc(beer.id)}
          alt={beer.name}
          fill
          sizes="(min-width: 1024px) 258px, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-6 transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="line-clamp-1 font-semibold">{beer.name}</h3>
        <span className="font-bold text-orange">{formatPrice(beer.price)}</span>
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
