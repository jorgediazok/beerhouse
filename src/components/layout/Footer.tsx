import Link from "next/link";
import { Beer } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-cream">
      <div className="px-6 py-14 sm:pt-14 sm:pr-12 sm:pb-14 sm:pl-12 lg:pr-16 lg:pl-24 xl:pr-20 xl:pl-28">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold to-orange text-dark">
                <Beer size={18} strokeWidth={2.25} />
              </span>
              <span className="bg-linear-to-br from-gold via-orange to-[#e7691a] bg-clip-text text-lg font-bold tracking-wide text-transparent">
                BEER HOUSE
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-cream/60">
              Cerveza artesanal e importada, a domicilio.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-gold uppercase">
              Explorá
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cream/70">
              <li>
                <Link href="/#ofertas" className="hover:text-orange">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/#nosotros" className="hover:text-orange">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="hover:text-orange">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-gold uppercase">
              Legal
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cream/70">
              <li>
                <Link href="/terminos" className="hover:text-orange">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-orange">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:text-right">
            <h3 className="text-xs font-semibold tracking-wide text-gold uppercase">
              Horarios
            </h3>
            <p className="mt-4 text-sm text-cream/70">
              Lunes a viernes
              <br /> 9:00 – 18:00
            </p>
            <p className="mt-3 text-sm text-cream/70">
              Sábados y domingos
              <br /> 12:00 – 24:00
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Beer House. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-cream/40">Hecho con 🍺 en Buenos Aires</p>
        </div>
      </div>
    </footer>
  );
}
