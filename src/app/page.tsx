import { getAllBeers } from "@/lib/contentful";
import { Hero } from "@/components/home/Hero";
import { Ofertas } from "@/components/home/Ofertas";
import { OurServices } from "@/components/home/OurServices";
import { About } from "@/components/home/About";
import { Testimonials } from "@/components/home/Testimonials";
import { Contacto } from "@/components/home/Contacto";

export default async function Home() {
  const beers = await getAllBeers();

  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <Ofertas beers={beers} />
      <OurServices />
      <About />
      <Testimonials />
      <Contacto />
    </div>
  );
}
