import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-dark px-6 text-center text-cream">
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-orange sm:text-7xl">
          BEER HOUSE
        </h1>
        <p className="max-w-md text-lg text-cream/80">
          Las mejores cervezas del mundo en tu casa
        </p>
        <Link
          href="/tienda"
          className="mt-4 rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
        >
          COMPRAR
        </Link>
      </div>
      <Image
        src="/images/hero-beer.png"
        alt="Cerveza Beer House"
        width={532}
        height={469}
        className="absolute -right-16 -bottom-8 w-64 opacity-30 sm:right-0 sm:w-96 sm:opacity-60"
        priority
      />
    </section>
  );
}
