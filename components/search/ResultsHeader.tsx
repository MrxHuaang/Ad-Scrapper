"use client";

import { Search, LayoutGrid, List, Link as LinkIcon, Download } from "lucide-react";

interface ResultsHeaderProps {
  total: number;
  filtered: number | null;
  lastSearchMs: number | null;
  viewMode: "table" | "cards";
  onViewChange: (v: "table" | "cards") => void;
  quickFilter: string;
  onQuickFilterChange: (v: string) => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
}

export function ResultsHeader({
  total,
  filtered,
  lastSearchMs,
  viewMode,
  onViewChange,
  quickFilter,
  onQuickFilterChange,
  onExportCsv,
  onExportExcel,
}: ResultsHeaderProps) {
  function handleCopyUrl() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-baseline gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-[var(--text-3)]">
          Results
        </h2>
        <span className="text-sm font-semibold text-[var(--text-1)]">
          {filtered !== null
            ? `Showing ${filtered} of ${total}`
            : `${total} results`}
        </span>
        {lastSearchMs !== null && (
          <span className="text-xs text-[var(--text-3)]">
            · {(lastSearchMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
            aria-hidden
          />
          <input
            type="text"
            value={quickFilter}
            onChange={(e) => onQuickFilterChange(e.target.value)}
            placeholder="Filter results…"
            className="w-44 rounded-md border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-7 pr-3 text-xs text-[var(--text-1)] placeholder:text-[var(--text-3)] transition-all focus:w-56 focus:border-[var(--border-strong)] focus:outline-none"
          />
        </div>

        <div className="flex overflow-hidden rounded-md border border-[var(--border)]">
          <button
            type="button"
            onClick={() => onViewChange("table")}
            className={`inline-flex items-center justify-center p-1.5 transition-colors ${
              viewMode === "table"
                ? "bg-[var(--surface-2)] text-[var(--text-1)]"
                : "text-[var(--text-3)] hover:text-[var(--text-2)]"
            }`}
            aria-label="Table view"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("cards")}
            className={`inline-flex items-center justify-center p-1.5 transition-colors ${
              viewMode === "cards"
                ? "bg-[var(--surface-2)] text-[var(--text-1)]"
                : "text-[var(--text-3)] hover:text-[var(--text-2)]"
            }`}
            aria-label="Card view"
          >
            <LayoutGrid size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopyUrl}
          className="inline-flex items-center justify-center rounded-md border border-[var(--border)] p-1.5 text-[var(--text-3)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-2)]"
          aria-label="Copy URL"
        >
          <LinkIcon size={14} />
        </button>

        <button type="button" onClick={onExportCsv} className="btn-outline btn-sm">
          <Download size={12} aria-hidden />
          CSV
        </button>
        <button type="button" onClick={onExportExcel} className="btn-outline btn-sm">
          <Download size={12} aria-hidden />
          Excel
        </button>
      </div>
    </div>
  );
}
