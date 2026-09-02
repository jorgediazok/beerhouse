"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";

function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartHydration />
      {children}
    </SessionProvider>
  );
}
