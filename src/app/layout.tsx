import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Catálogo de cervezas importadas y artesanales de todo el mundo, con envíos a domicilio en 24 horas. Pedí online y recibí tu cerveza favorita en tu casa.",
  keywords: [
    "cerveza artesanal",
    "cerveza importada",
    "delivery de cerveza",
    "beer house",
    "cervecería online",
  ],
  authors: [{ name: "Jorge Diaz" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Catálogo de cervezas importadas y artesanales de todo el mundo, con envíos a domicilio en 24 horas.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Catálogo de cervezas importadas y artesanales de todo el mundo, con envíos a domicilio en 24 horas.",
  },
};

export const viewport: Viewport = {
  themeColor: "#191919",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-cream text-dark">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-orange focus:px-6 focus:py-3 focus:font-semibold focus:text-dark"
        >
          Saltar al contenido principal
        </a>
        <Providers>
          <Navbar />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="top-center" />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
