"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";

type Errors = Partial<Record<"name" | "rating" | "comment", string>>;

function validate(name: string, rating: number, comment: string): Errors {
  const errors: Errors = {};

  if (!name.trim()) errors.name = "Ingresá tu nombre.";
  else if (name.trim().length < 2) errors.name = "Ingresá un nombre válido.";
  else if (name.length > 100) errors.name = "Máximo 100 caracteres.";

  if (rating < 1 || rating > 5) errors.rating = "Elegí una calificación de 1 a 5 estrellas.";

  if (!comment.trim()) errors.comment = "Contanos qué te pareció.";
  else if (comment.trim().length < 3) errors.comment = "Escribí un poco más.";
  else if (comment.length > 1000) errors.comment = "Máximo 1000 caracteres.";

  return errors;
}

export function ReviewForm({
  beerId,
  initialReview,
  onSuccess,
}: {
  beerId: string;
  initialReview: { name: string; rating: number; comment: string } | null;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialReview?.name ?? "");
  const [rating, setRating] = useState(initialReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialReview?.comment ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectRating = (star: number) => {
    setRating(star);
    if (errors.rating) setErrors({ ...errors, rating: undefined });
  };

  // Roving-tabindex + arrow-key navigation per the ARIA radiogroup pattern —
  // only the checked (or first) star is a tab stop, arrows move selection.
  const handleStarsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = rating || 1;
    let next = current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = current < 5 ? current + 1 : 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = current > 1 ? current - 1 : 5;
    else if (e.key === "Home") next = 1;
    else if (e.key === "End") next = 5;
    else return;

    e.preventDefault();
    selectRating(next);
    starRefs.current[next - 1]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(name, rating, comment);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSending(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beerId, name, rating, comment }),
      });

      if (!res.ok) throw new Error();

      toast.success(
        initialReview ? "Tu reseña fue actualizada." : "¡Gracias por tu reseña!"
      );
      if (onSuccess) {
        onSuccess();
      } else {
        setName("");
        setRating(0);
        setComment("");
      }
      router.refresh();
    } catch {
      toast.error("No pudimos guardar tu reseña. Probá de nuevo en un rato.");
    } finally {
      setSending(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-dark/8 bg-white p-6"
    >
      <h3 className="text-base font-bold text-dark">
        {initialReview ? "Editá tu reseña" : "Dejá tu reseña"}
      </h3>
      <div className="mt-4 flex flex-col gap-4">
        <label
          htmlFor="review-name"
          className="flex flex-col gap-1.5 text-sm font-medium text-dark/70"
        >
          Nombre
          <input
            id="review-name"
            type="text"
            required
            maxLength={100}
            placeholder="Tu nombre"
            value={name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "review-name-error" : undefined}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange aria-invalid:border-red-400"
          />
          {errors.name && (
            <span id="review-name-error" className="text-xs font-normal text-red-500">
              {errors.name}
            </span>
          )}
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-dark/70">Calificación</span>
          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHoverRating(0)}
            onKeyDown={handleStarsKeyDown}
            role="radiogroup"
            aria-label="Calificación"
            aria-describedby={errors.rating ? "review-rating-error" : undefined}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                ref={(el) => {
                  starRefs.current[star - 1] = el;
                }}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
                tabIndex={star === (rating || 1) ? 0 : -1}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => selectRating(star)}
                className="p-0.5"
              >
                <Star
                  size={24}
                  className={star <= displayRating ? "fill-orange text-orange" : "text-dark/20"}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <span id="review-rating-error" className="text-xs font-normal text-red-500">
              {errors.rating}
            </span>
          )}
        </div>
        <label
          htmlFor="review-comment"
          className="flex flex-col gap-1.5 text-sm font-medium text-dark/70"
        >
          Comentario
          <textarea
            id="review-comment"
            required
            rows={3}
            maxLength={1000}
            placeholder="Contanos qué te pareció esta cerveza"
            value={comment}
            aria-invalid={!!errors.comment}
            aria-describedby={errors.comment ? "review-comment-error" : undefined}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment) setErrors({ ...errors, comment: undefined });
            }}
            className="rounded-lg border border-dark/10 bg-cream/40 px-4 py-3 text-dark outline-none focus:border-orange aria-invalid:border-red-400"
          />
          {errors.comment && (
            <span id="review-comment-error" className="text-xs font-normal text-red-500">
              {errors.comment}
            </span>
          )}
        </label>
        <button
          type="submit"
          disabled={sending}
          className="self-start rounded-full bg-dark px-8 py-3.5 font-semibold text-cream transition hover:bg-orange hover:text-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Enviando..." : initialReview ? "Actualizar reseña" : "Publicar reseña"}
        </button>
      </div>
    </form>
  );
}
