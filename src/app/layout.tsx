import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beer House",
  description: "Delivery de cerveza artesanal",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-cream text-dark">
        <Providers>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
