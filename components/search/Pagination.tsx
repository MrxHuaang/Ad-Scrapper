"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  function handleChange(page: number) {
    onPageChange(page);
    // Scroll to results section
    const el = document.getElementById("results-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav className="mt-4 flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => handleChange(currentPage - 1)}
        className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-1)] disabled:opacity-40 disabled:pointer-events-none"
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="px-1.5 py-1 text-xs text-[var(--text-3)]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => handleChange(p)}
            className={`min-w-[28px] rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              p === currentPage
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)] hover:text-[var(--text-1)]"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => handleChange(currentPage + 1)}
        className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-1)] disabled:opacity-40 disabled:pointer-events-none"
      >
        →
      </button>
    </nav>
  );
}
