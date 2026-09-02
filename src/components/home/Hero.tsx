import Link from "next/link";
import { HeroVideo } from "@/components/home/HeroVideo";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden px-6 text-cream">
      <HeroVideo />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(12,11,9,0.86)_0%,rgba(12,11,9,0.72)_42%,rgba(12,11,9,0.18)_60%,rgba(12,11,9,0.02)_78%)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex max-w-[90%] flex-col items-start gap-4 sm:max-w-md lg:max-w-lg">
          <h1 className="bg-linear-to-br from-gold via-orange to-[#e7691a] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            BEER HOUSE
          </h1>
          <p className="text-lg text-cream/90">
            Las mejores cervezas del mundo en tu casa
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/tienda"
              className="rounded-full bg-linear-to-br from-gold to-orange px-8 py-3 font-semibold text-dark transition hover:-translate-y-0.5 hover:brightness-110"
            >
              COMPRAR
            </Link>
            <Link
              href="#ofertas"
              className="rounded-full border border-cream/50 px-6 py-3 font-medium text-cream transition hover:border-cream/85 hover:bg-cream/10"
            >
              Ver Ofertas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
