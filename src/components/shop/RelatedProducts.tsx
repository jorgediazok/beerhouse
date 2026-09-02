import type { Beer } from "@/types/beer";
import { getCategoryForBeer } from "@/lib/categories";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductRail } from "@/components/shop/ProductRail";

export function RelatedProducts({
  beers,
  excludeId,
  categorySlug,
}: {
  beers: Beer[];
  excludeId: string;
  categorySlug?: string;
}) {
  const others = beers.filter((beer) => beer.id !== excludeId);
  const sameCategory = categorySlug
    ? others.filter((beer) => getCategoryForBeer(beer.id)?.slug === categorySlug)
    : [];
  const sameCategoryIds = new Set(sameCategory.map((beer) => beer.id));
  const rest = others.filter((beer) => !sameCategoryIds.has(beer.id));
  const related = [...sameCategory, ...rest].slice(0, 8);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <h2 className="text-2xl font-bold">También te podría gustar</h2>
      <div className="mt-6">
        <ProductRail itemLabel="producto">
          {related.map((beer) => (
            <div key={beer.id} className="w-56 shrink-0">
              <ProductCard beer={beer} />
            </div>
          ))}
        </ProductRail>
      </div>
    </section>
  );
}
