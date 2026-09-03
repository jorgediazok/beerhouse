import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import { getAllBeers, getBeerById } from "@/lib/contentful";
import { OFERTAS } from "@/lib/ofertas";
import { getCategoryForBeer } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { productImageSrc } from "@/lib/images";
import { SITE_URL } from "@/lib/site";
import { getStock } from "@/lib/stock";
import { auth } from "@/lib/auth";
import { getRatingSummary, getReviews } from "@/lib/reviews";
import { AddToCartControls } from "@/components/shop/AddToCartControls";
import { RelatedProducts } from "@/components/shop/RelatedProducts";
import { ShareProduct } from "@/components/shop/ShareProduct";
import { StarRating } from "@/components/shop/StarRating";
import { ProductReviews } from "@/components/shop/ProductReviews";
import { ProductImage } from "@/components/ui/ProductImage";
import { BackButton } from "@/components/ui/BackButton";

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
  const category = getCategoryForBeer(beer.id);
  const beers = await getAllBeers();
  const [stock, summary, reviews, session] = await Promise.all([
    getStock(beer.id),
    getRatingSummary(beer.id),
    getReviews(beer.id),
    auth(),
  ]);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between gap-4">
          <BackButton />
          <p className="text-sm text-dark/45">
            <Link href="/tienda" className="hover:text-orange">
              Tienda
            </Link>{" "}
            /{" "}
            {category && (
              <>
                <Link
                  href={`/tienda?categoria=${category.slug}`}
                  className="hover:text-orange"
                >
                  {category.label}
                </Link>{" "}
                /{" "}
              </>
            )}
            <span className="text-dark/70">{beer.name}</span>
          </p>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative h-80 w-full overflow-hidden rounded-xl border border-dark/8 bg-cream lg:h-112">
            {oferta && (
              <span className="absolute top-3 left-3 z-10 rounded-md bg-orange px-2.5 py-1 font-mono text-xs font-bold text-white">
                -{oferta.discountPercent}%
              </span>
            )}
            <ProductImage
              src={productImageSrc(beer.id)}
              alt={beer.name}
              fill
              sizes="(min-width: 1024px) 468px, 100vw"
              className="object-contain p-10"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{beer.name}</h1>
            <a href="#reseñas" className="mt-2 flex items-center gap-2 w-fit">
              <StarRating value={summary.average} size={16} />
              <span className="text-sm text-dark/60">
                {summary.count > 0
                  ? `${summary.average.toFixed(1)} (${summary.count})`
                  : "Sin reseñas"}
              </span>
            </a>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-xl font-bold text-orange">
                {formatPrice(beer.price)}
              </span>
              {originalPrice && (
                <span className="text-base text-dark/40 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <p className="mt-4 text-dark/70">{beer.descriptionExtended}</p>
            <div className="mt-8">
              <AddToCartControls beer={beer} stock={stock} />
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-dark/8 pt-6 text-sm text-dark/60">
              <span className="flex items-center gap-2">
                <Truck size={18} className="text-orange" />
                Envío a domicilio
              </span>
              <span className="flex items-center gap-2">
                <CreditCard size={18} className="text-orange" />
                Pago seguro
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-orange" />
                Compra protegida
              </span>
            </div>

            <div className="mt-4">
              <ShareProduct
                url={`${SITE_URL}/tienda/${beer.id}`}
                text={`Mirá ${beer.name} en Beer House`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ProductReviews
          id="reseñas"
          beerId={beer.id}
          summary={summary}
          reviews={reviews}
          hasSession={!!session}
          currentUserId={session?.user?.id ?? null}
        />
      </div>

      <div className="mt-16">
        <RelatedProducts
          beers={beers}
          excludeId={beer.id}
          categorySlug={category?.slug}
        />
      </div>
    </div>
  );
}
