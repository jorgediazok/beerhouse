import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      <Link
        href={`/tienda?page=${Math.max(1, currentPage - 1)}`}
        className="rounded-full px-3 py-1 text-dark/60 hover:bg-dark/5 aria-disabled:pointer-events-none aria-disabled:opacity-30"
        aria-disabled={currentPage === 1}
      >
        {"<"}
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={`/tienda?page=${page}`}
          className={`h-9 w-9 rounded-full text-center leading-9 ${
            page === currentPage ? "bg-orange text-dark font-semibold" : "hover:bg-dark/5"
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={`/tienda?page=${Math.min(totalPages, currentPage + 1)}`}
        className="rounded-full px-3 py-1 text-dark/60 hover:bg-dark/5 aria-disabled:pointer-events-none aria-disabled:opacity-30"
        aria-disabled={currentPage === totalPages}
      >
        {">"}
      </Link>
    </nav>
  );
}
