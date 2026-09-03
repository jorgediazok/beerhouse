import type { Metadata } from "next";
import Link from "next/link";
import { getAllBeers } from "@/lib/contentful";
import { CATEGORIES, getCategoryBySlug, getCategoryForBeer } from "@/lib/categories";
import { ProductCard } from "@/components/shop/ProductCard";
import { Pagination } from "@/components/shop/Pagination";
import { SearchBar } from "@/components/shop/SearchBar";
import { getStockMany } from "@/lib/stock";

const BEERS_PER_PAGE = 8;

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Explorá nuestro catálogo completo de cervezas importadas y artesanales, con envíos a domicilio en 24 horas.",
};

export default async function TiendaPage({
  searchParams,
}: PageProps<"/tienda">) {
  const { page, categoria, q } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const activeCategory =
    typeof categoria === "string" ? getCategoryBySlug(categoria) : undefined;
  const query = typeof q === "string" ? q.trim() : "";

  const allBeers = await getAllBeers();
  let beers = activeCategory
    ? allBeers.filter((beer) => getCategoryForBeer(beer.id)?.slug === activeCategory.slug)
    : allBeers;

  if (query) {
    const normalizedQuery = query.toLowerCase();
    beers = beers.filter((beer) => beer.name.toLowerCase().includes(normalizedQuery));
  }

  const totalPages = Math.max(1, Math.ceil(beers.length / BEERS_PER_PAGE));
  const start = (currentPage - 1) * BEERS_PER_PAGE;
  const currentBeers = beers.slice(start, start + BEERS_PER_PAGE);
  const stockByBeerId = await getStockMany(currentBeers.map((beer) => beer.id));

  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("categoria", slug);
    if (query) params.set("q", query);
    const qs = params.toString();
    return qs ? `/tienda?${qs}` : "/tienda";
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-3xl font-bold">Catálogo de Cervezas</h1>

      <SearchBar query={query} categoria={activeCategory?.slug} />

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href={categoryHref()}
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
            href={categoryHref(category.slug)}
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
        <div className="mt-10 text-center text-dark/50">
          {query ? (
            <>
              <p>
                No encontramos cervezas para &ldquo;{query}&rdquo;
                {activeCategory ? ` en ${activeCategory.label}` : ""}.
              </p>
              <Link
                href={activeCategory ? `/tienda?categoria=${activeCategory.slug}` : "/tienda"}
                className="mt-2 inline-block text-orange underline"
              >
                Limpiar búsqueda
              </Link>
            </>
          ) : (
            <p>No hay cervezas disponibles en este momento.</p>
          )}
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {currentBeers.map((beer) => (
            <ProductCard key={beer.id} beer={beer} stock={stockByBeerId[beer.id]} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        categoria={activeCategory?.slug}
        query={query}
      />
    </div>
  );
}
