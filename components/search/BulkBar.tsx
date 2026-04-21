"use client";

import { Download, X } from "lucide-react";

interface BulkBarProps {
  selectedCount: number;
  hasActiveFilter: boolean;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onExportZip: () => void;
  onDeselect: () => void;
}

export function BulkBar({
  selectedCount,
  hasActiveFilter,
  onExportCsv,
  onExportExcel,
  onExportZip,
  onDeselect,
}: BulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="fixed left-1/2 top-0 z-50 -translate-x-1/2"
      style={{ animation: "toast-slide-in 0.2s ease-out" }}
    >
      <div className="flex items-center gap-3 rounded-b-lg border border-t-0 border-[var(--border)] bg-[var(--surface)] px-4 py-2 shadow-lg">
        <span className="text-sm font-semibold text-[var(--text-1)]">
          {selectedCount} selected
        </span>

        {hasActiveFilter && (
          <span className="rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
            Filter on
          </span>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="btn-outline btn-sm"
          >
            <Download size={12} aria-hidden />
            CSV
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="btn-outline btn-sm"
          >
            <Download size={12} aria-hidden />
            Excel
          </button>
          <button
            type="button"
            onClick={onExportZip}
            disabled
            title="Coming in a later release"
            className="btn-outline btn-sm opacity-50"
          >
            <Download size={12} aria-hidden />
            Download PDFs
          </button>
        </div>

        <button
          type="button"
          onClick={onDeselect}
          className="ml-1 rounded p-1 text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
          aria-label="Clear selection"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
