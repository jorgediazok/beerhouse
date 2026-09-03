"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { formatDate } from "@/lib/format";
import { StarRating } from "@/components/shop/StarRating";
import { ReviewForm } from "@/components/shop/ReviewForm";

export function OwnReviewItem({
  beerId,
  review,
}: {
  beerId: string;
  review: { name: string; rating: number; comment: string; createdAt: Date };
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ReviewForm
        beerId={beerId}
        initialReview={review}
        onSuccess={() => setEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <StarRating value={review.rating} size={14} />
        <span className="text-sm font-medium text-dark/70">{review.name}</span>
        <span className="text-xs text-dark/40">{formatDate(review.createdAt)}</span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Editar tu reseña"
          className="text-dark/40 hover:text-orange"
        >
          <Pencil size={14} />
        </button>
      </div>
      <p className="mt-2 text-dark/80">{review.comment}</p>
    </>
  );
}
