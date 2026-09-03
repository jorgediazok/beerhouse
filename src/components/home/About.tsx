import { HistoriaCarousel } from "@/components/home/HistoriaCarousel";

export function About() {
  return (
    <section id="nosotros" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold">Nuestra Historia</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-dark/60">
          Cinco amigos, un antojo de cerveza distinta y una changa que se
          convirtió en Beer House.
        </p>

        <div className="mt-12">
          <HistoriaCarousel />
        </div>
      </div>
    </section>
  );
}
