import type { Metadata } from "next";
import Link from "next/link";
import { getAllBeers } from "@/lib/contentful";
import { CATEGORIES, getCategoryBySlug, getCategoryForBeer } from "@/lib/categories";
import { ProductCard } from "@/components/shop/ProductCard";
import { Pagination } from "@/components/shop/Pagination";

const BEERS_PER_PAGE = 8;

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Explorá nuestro catálogo completo de cervezas importadas y artesanales, con envíos a domicilio en 24 horas.",
};

export default async function TiendaPage({
  searchParams,
}: PageProps<"/tienda">) {
  const { page, categoria } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const activeCategory =
    typeof categoria === "string" ? getCategoryBySlug(categoria) : undefined;

  const allBeers = await getAllBeers();
  const beers = activeCategory
    ? allBeers.filter((beer) => getCategoryForBeer(beer.id)?.slug === activeCategory.slug)
    : allBeers;

  const totalPages = Math.max(1, Math.ceil(beers.length / BEERS_PER_PAGE));
  const start = (currentPage - 1) * BEERS_PER_PAGE;
  const currentBeers = beers.slice(start, start + BEERS_PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-3xl font-bold">Catálogo de Cervezas</h1>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/tienda"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            !activeCategory
              ? "bg-dark text-cream"
              : "bg-white text-dark/60 hover:text-orange"
          }`}
        >
          Todas
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/tienda?categoria=${category.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory?.slug === category.slug
                ? "bg-dark text-cream"
                : "bg-white text-dark/60 hover:text-orange"
            }`}
          >
            {category.label}
          </Link>
        ))}
      </div>

      {currentBeers.length === 0 ? (
        <p className="mt-10 text-center text-dark/50">
          No hay cervezas disponibles en este momento.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {currentBeers.map((beer) => (
            <ProductCard key={beer.id} beer={beer} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        categoria={activeCategory?.slug}
      />
    </div>
  );
}
