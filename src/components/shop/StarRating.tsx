import { Star } from "lucide-react";

export function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(value) ? "fill-orange text-orange" : "text-dark/20"}
        />
      ))}
    </div>
  );
}
