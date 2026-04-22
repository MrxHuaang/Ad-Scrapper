"use client";

import { Search, LayoutGrid, List, Download, Link as LinkIcon } from "lucide-react";

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
  total, filtered, lastSearchMs, viewMode, onViewChange,
  quickFilter, onQuickFilterChange, onExportCsv, onExportExcel,
}: ResultsHeaderProps) {
  function handleCopyUrl() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }

  const shown = filtered ?? total;
  const isFiltered = filtered !== null;

  return (
    <div
      className="mb-3 flex flex-wrap items-center gap-3 rounded-xl px-4 py-2.5"
      style={{ background: "#0d0d0d", border: "1px solid #1e1e1e" }}
    >
      {/* Count */}
      <div className="flex items-baseline gap-2 mr-auto">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Results</span>
        <span className="text-sm font-bold text-white">{shown.toLocaleString()}</span>
        {isFiltered && (
          <span className="text-xs text-white/30">/ {total.toLocaleString()}</span>
        )}
        {lastSearchMs !== null && (
          <span className="text-[11px] tabular-nums text-white/25">
            {(lastSearchMs / 1000).toFixed(2)}s
          </span>
        )}
      </div>

      {/* Filter input */}
      <div className="relative">
        <Search size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          value={quickFilter}
          onChange={(e) => onQuickFilterChange(e.target.value)}
          placeholder="Filter results…"
          className="w-40 rounded-lg py-1.5 pl-8 pr-3 text-[12px] text-white/70 placeholder:text-white/25 transition-all focus:w-56 focus:outline-none"
          style={{ background: "#141414", border: "1px solid #252525" }}
        />
      </div>

      {/* View toggle */}
      <div className="flex overflow-hidden rounded-lg" style={{ border: "1px solid #252525" }}>
        {(["table", "cards"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onViewChange(mode)}
            className={`cursor-pointer inline-flex items-center justify-center px-2.5 py-1.5 transition-colors ${
              viewMode === mode ? "text-white" : "text-white/25 hover:text-white/55"
            }`}
            style={{ background: viewMode === mode ? "#1e1e1e" : "transparent" }}
            aria-label={`${mode} view`}
          >
            {mode === "table" ? <List size={13} /> : <LayoutGrid size={13} />}
          </button>
        ))}
      </div>

      {/* Copy URL */}
      <button
        type="button"
        onClick={handleCopyUrl}
        className="cursor-pointer inline-flex items-center justify-center rounded-lg p-1.5 text-white/25 transition-colors hover:text-white/60"
        style={{ border: "1px solid #252525", background: "transparent" }}
        aria-label="Copy URL"
      >
        <LinkIcon size={13} />
      </button>

      {/* Export buttons — liquid glass */}
      {[
        { label: "CSV", fn: onExportCsv },
        { label: "Excel", fn: onExportExcel },
      ].map(({ label, fn }) => (
        <button
          key={label}
          type="button"
          onClick={fn}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-white/45 backdrop-blur-sm transition-all hover:text-white/80"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Download size={11} aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
