import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBeerById } from "@/lib/contentful";
import { AddToCartControls } from "@/components/shop/AddToCartControls";

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

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
      <div className="relative h-80 w-full rounded-xl bg-cream lg:h-112">
        {beer.imageUrl && (
          <Image
            src={beer.imageUrl}
            alt={beer.name}
            fill
            className="object-contain p-10"
          />
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{beer.name}</h1>
        <span className="mt-2 block text-xl font-bold text-orange">
          $ {beer.price}
        </span>
        <p className="mt-4 text-dark/70">{beer.descriptionExtended}</p>
        <div className="mt-8">
          <AddToCartControls beer={beer} />
        </div>
      </div>
    </div>
  );
}
