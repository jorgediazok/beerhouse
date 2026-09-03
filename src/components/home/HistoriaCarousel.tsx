"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HISTORIA } from "@/lib/historia";

export function HistoriaCarousel() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const frame = requestAnimationFrame(onSelect);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => cancelAnimationFrame(frame);
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {HISTORIA.map((chapter) => (
            <div
              key={chapter.num}
              className="grid min-w-0 shrink-0 grow-0 basis-full items-center gap-10 lg:grid-cols-2"
            >
              <div className="relative aspect-6/5 overflow-hidden rounded-2xl shadow-xl shadow-dark/20">
                <span className="absolute top-4 left-4 z-10 rounded-full bg-dark/50 px-3 py-1 font-mono text-xs font-semibold text-white backdrop-blur-sm">
                  {chapter.num} / 0{HISTORIA.length}
                </span>
                <Image
                  src={chapter.image}
                  alt={chapter.alt}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="px-1">
                <span className="inline-block rounded-full border border-gold/35 bg-gold/10 px-3 py-1 font-mono text-xs font-semibold text-gold">
                  {chapter.num}
                </span>
                <p className="mt-4 text-xs font-bold tracking-wider text-dark/50 uppercase">
                  {chapter.when}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold text-balance lg:text-3xl">
                  {chapter.title}
                </h3>
                <p className="mt-4 max-w-lg text-dark/70">{chapter.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Capítulo anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-dark/10 bg-white text-dark transition hover:border-orange hover:text-orange"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-1.5">
          {HISTORIA.map((chapter, i) => (
            <button
              key={chapter.num}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Ir al capítulo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIndex ? "w-6 bg-orange" : "w-1.5 bg-dark/15"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Capítulo siguiente"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-dark/10 bg-white text-dark transition hover:border-orange hover:text-orange"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
