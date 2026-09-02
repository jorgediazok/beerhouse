import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">HEY! NO HAY NADA ACÁ</h1>
      <Link
        href="/"
        className="rounded-full bg-orange px-8 py-3 font-semibold text-dark transition hover:bg-gold"
      >
        Inicio
      </Link>
    </div>
  );
}
