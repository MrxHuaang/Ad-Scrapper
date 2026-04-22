"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  if (total > 1) pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  function handleChange(page: number) {
    onPageChange(page);
    document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const btnBase =
    "cursor-pointer min-w-[30px] rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all";

  return (
    <nav className="mt-4 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => handleChange(currentPage - 1)}
        className={`${btnBase} text-white/35 disabled:pointer-events-none disabled:opacity-30 hover:text-white`}
        style={{ background: "#111", border: "1px solid #222" }}
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-1.5 py-1 text-[12px] text-white/20">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => handleChange(p as number)}
            className={`${btnBase}`}
            style={
              p === currentPage
                ? { background: "#fff", color: "#000", border: "1px solid #fff" }
                : { background: "#111", border: "1px solid #222", color: "rgba(255,255,255,0.45)" }
            }
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => handleChange(currentPage + 1)}
        className={`${btnBase} text-white/35 disabled:pointer-events-none disabled:opacity-30 hover:text-white`}
        style={{ background: "#111", border: "1px solid #222" }}
      >
        →
      </button>
    </nav>
  );
}
