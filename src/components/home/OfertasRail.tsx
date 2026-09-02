"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Beer } from "@/types/beer";
import type { OfertaOverride } from "@/lib/ofertas";
import { OfertaCard } from "@/components/home/OfertaCard";

export function OfertasRail({
  items,
}: {
  items: { beer: Beer; oferta: OfertaOverride }[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const frame = requestAnimationFrame(onSelect);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => cancelAnimationFrame(frame);
  }, [emblaApi, onSelect]);

  const maskImage = `linear-gradient(to right, ${
    canScrollPrev ? "transparent" : "black"
  }, black 28px, black calc(100% - 28px), ${
    canScrollNext ? "transparent" : "black"
  })`;

  return (
    <div className="mt-10">
      <div className="relative">
        <div
          ref={emblaRef}
          className="overflow-hidden"
          style={{ WebkitMaskImage: maskImage, maskImage }}
        >
          <div className="flex gap-5 px-1 pb-4">
            {items.map(({ beer, oferta }) => (
              <OfertaCard key={beer.id} beer={beer} oferta={oferta} />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Ver oferta anterior"
          disabled={!canScrollPrev}
          className="absolute top-20 -left-4 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-dark shadow-md transition hover:text-orange disabled:pointer-events-none disabled:opacity-0 sm:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Ver siguiente oferta"
          disabled={!canScrollNext}
          className="absolute top-20 -right-4 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 text-dark shadow-md transition hover:text-orange disabled:pointer-events-none disabled:opacity-0 sm:flex"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-1 flex justify-center gap-1.5">
        {items.map(({ beer }, i) => (
          <button
            key={beer.id}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Ir a la oferta ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === selectedIndex ? "w-5 bg-orange" : "w-1.5 bg-dark/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
