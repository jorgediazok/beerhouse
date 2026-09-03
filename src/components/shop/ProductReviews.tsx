import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { ReviewWithAuthor } from "@/lib/reviews";
import { StarRating } from "@/components/shop/StarRating";
import { ReviewForm } from "@/components/shop/ReviewForm";
import { OwnReviewItem } from "@/components/shop/OwnReviewItem";

export function ProductReviews({
  id,
  beerId,
  summary,
  reviews,
  hasSession,
  currentUserId,
}: {
  id: string;
  beerId: string;
  summary: { average: number; count: number };
  reviews: ReviewWithAuthor[];
  hasSession: boolean;
  currentUserId: string | null;
}) {
  const ownReview = currentUserId ? reviews.find((r) => r.userId === currentUserId) : undefined;

  return (
    <div id={id} className="mx-auto max-w-5xl scroll-mt-24 px-6">
      <div className="border-t border-dark/8 pt-10">
        <h2 className="text-2xl font-bold text-dark">Reseñas</h2>
        <div className="mt-2 flex items-center gap-2">
          <StarRating value={summary.average} />
          <span className="text-sm text-dark/60">
            {summary.count > 0
              ? `${summary.average.toFixed(1)} · ${summary.count} reseña${summary.count === 1 ? "" : "s"}`
              : "Todavía no hay reseñas"}
          </span>
        </div>

        {reviews.length > 0 && (
          <ul className="mt-8 flex flex-col gap-6">
            {reviews.map((review) =>
              review.userId === currentUserId ? (
                <li key={review.id} className="border-b border-dark/8 pb-6 last:border-b-0">
                  <OwnReviewItem beerId={beerId} review={review} />
                </li>
              ) : (
                <li key={review.id} className="border-b border-dark/8 pb-6 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <StarRating value={review.rating} size={14} />
                    <span className="text-sm font-medium text-dark/70">{review.name}</span>
                    <span className="text-xs text-dark/40">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-dark/80">{review.comment}</p>
                </li>
              )
            )}
          </ul>
        )}

        <div className="mt-8 max-w-xl">
          {!hasSession && (
            <div className="rounded-2xl border border-dark/8 bg-cream/60 p-6 text-center">
              <p className="text-dark/70">
                <Link
                  href={`/login?callbackUrl=/tienda/${beerId}%23${id}`}
                  className="font-semibold text-orange hover:underline"
                >
                  Iniciá sesión
                </Link>{" "}
                para dejar tu reseña.
              </p>
            </div>
          )}
          {hasSession && !ownReview && <ReviewForm beerId={beerId} initialReview={null} />}
        </div>
      </div>
    </div>
  );
}
