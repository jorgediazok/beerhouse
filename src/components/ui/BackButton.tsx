"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-sm text-dark/60 transition hover:text-orange"
    >
      <ArrowLeft size={16} />
      Volver
    </button>
  );
}
