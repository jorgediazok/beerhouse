import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBeerById } from "@/lib/contentful";
import { OFERTAS } from "@/lib/ofertas";
import { AddToCartControls } from "@/components/shop/AddToCartControls";
import { ProductImage } from "@/components/ui/ProductImage";

const priceFormatter = new Intl.NumberFormat("es-CL", {
  maximumFractionDigits: 0,
});

export async function generateMetadata({
  params,
}: PageProps<"/tienda/[id]">): Promise<Metadata> {
  const { id } = await params;
  const beer = await getBeerById(id);

  if (!beer) {
    return { title: "Cerveza no encontrada" };
  }

  return {
    title: beer.name,
    description: beer.description,
    openGraph: {
      title: beer.name,
      description: beer.description,
      images: beer.imageUrl ? [{ url: beer.imageUrl }] : undefined,
    },
  };
}

export default async function TiendaDetailsPage({
  params,
}: PageProps<"/tienda/[id]">) {
  const { id } = await params;
  const beer = await getBeerById(id);

  if (!beer) {
    notFound();
  }

  const oferta = OFERTAS.find((o) => o.beerId === beer.id);
  const originalPrice = oferta
    ? Math.round(beer.price / (1 - oferta.discountPercent / 100))
    : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm text-dark/45">
        <Link href="/tienda" className="hover:text-orange">
          Tienda
        </Link>{" "}
        / <span className="text-dark/70">{beer.name}</span>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative h-80 w-full overflow-hidden rounded-xl border border-dark/8 bg-cream lg:h-112">
          {oferta && (
            <span className="absolute top-3 left-3 z-10 rounded-md bg-orange px-2.5 py-1 font-mono text-xs font-bold text-white">
              -{oferta.discountPercent}%
            </span>
          )}
          <ProductImage
            src={oferta ? oferta.cutoutSrc : beer.imageUrl}
            alt={beer.name}
            fill
            sizes="(min-width: 1024px) 468px, 100vw"
            className="object-contain p-10"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{beer.name}</h1>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-xl font-bold text-orange">
              $ {priceFormatter.format(beer.price)}
            </span>
            {originalPrice && (
              <span className="text-base text-dark/40 line-through">
                $ {priceFormatter.format(originalPrice)}
              </span>
            )}
          </div>
          <p className="mt-4 text-dark/70">{beer.descriptionExtended}</p>
          <div className="mt-8">
            <AddToCartControls beer={beer} />
          </div>
        </div>
      </div>
    </div>
  );
}
