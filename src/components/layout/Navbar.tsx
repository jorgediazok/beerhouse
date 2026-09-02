"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Link as ScrollLink } from "react-scroll";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Beer, ShoppingCart } from "lucide-react";
import { useCartStore, selectTotalItems } from "@/store/cart-store";

const sections = [
  { id: "ofertas", label: "Ofertas" },
  { id: "nosotros", label: "Nosotros" },
  { id: "contacto", label: "Contacto" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const totalItems = useCartStore(selectTotalItems);
  const isHome = pathname === "/";

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav aria-label="Principal" className="sticky top-0 z-50 bg-dark text-cream shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold to-orange text-dark">
            <Beer size={18} strokeWidth={2.25} />
          </span>
          <span className="bg-linear-to-br from-gold via-orange to-[#e7691a] bg-clip-text text-lg font-bold tracking-wide text-transparent">
            BEER HOUSE
          </span>
        </Link>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <ul
          id="primary-menu"
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute top-full left-0 w-full flex-col gap-4 bg-dark px-6 py-4 md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:bg-transparent md:px-0 md:py-0`}
        >
          {sections.map((section) =>
            isHome ? (
              <li key={section.id}>
                <ScrollLink
                  to={section.id}
                  smooth
                  duration={500}
                  offset={-72}
                  onClick={closeMenu}
                  className="cursor-pointer text-sm font-medium tracking-wide uppercase hover:text-orange"
                >
                  {section.label}
                </ScrollLink>
              </li>
            ) : (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  onClick={closeMenu}
                  className="text-sm font-medium tracking-wide uppercase hover:text-orange"
                >
                  {section.label}
                </Link>
              </li>
            )
          )}
          <li>
            <Link
              href="/tienda"
              onClick={closeMenu}
              className="flex items-center gap-1 text-sm font-medium tracking-wide uppercase hover:text-orange"
            >
              Tienda <Beer size={16} aria-hidden="true" />
            </Link>
          </li>
          <li>
            {session ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium tracking-wide uppercase hover:text-orange"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="text-sm font-medium tracking-wide uppercase hover:text-orange"
              >
                Login
              </Link>
            )}
          </li>
          <li>
            <Link
              href="/cart"
              onClick={closeMenu}
              className="relative flex items-center"
              aria-label={
                totalItems > 0
                  ? `Carrito de compras, ${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`
                  : "Carrito de compras, vacío"
              }
            >
              <ShoppingCart aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-xs font-bold text-dark"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
