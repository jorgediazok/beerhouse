import type { Metadata } from "next";
import { getAllBeers } from "@/lib/contentful";
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
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const beers = await getAllBeers();
  const totalPages = Math.max(1, Math.ceil(beers.length / BEERS_PER_PAGE));
  const start = (currentPage - 1) * BEERS_PER_PAGE;
  const currentBeers = beers.slice(start, start + BEERS_PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-3xl font-bold">Catálogo de Cervezas</h1>

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

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
