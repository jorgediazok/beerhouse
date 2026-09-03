"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const DEBOUNCE_MS = 300;

export function SearchBar({ query = "", categoria }: { query?: string; categoria?: string }) {
  const [value, setValue] = useState(query);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (categoria) params.set("categoria", categoria);
      if (next.trim()) params.set("q", next.trim());
      const qs = params.toString();
      router.replace(qs ? `/tienda?${qs}` : "/tienda", { scroll: false });
    }, DEBOUNCE_MS);
  };

  return (
    <div role="search" className="mx-auto mt-6 max-w-md">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-dark/35"
          size={18}
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={handleChange}
          placeholder="Buscar cervezas..."
          aria-label="Buscar cervezas"
          className="w-full rounded-full border border-dark/10 bg-white py-2.5 pr-4 pl-11 text-sm outline-none focus:border-orange"
        />
      </div>
    </div>
  );
}
