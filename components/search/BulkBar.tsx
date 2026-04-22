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
  selectedCount, hasActiveFilter, onExportCsv, onExportExcel, onExportZip, onDeselect,
}: BulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      style={{ animation: "toast-slide-in 0.25s cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-2.5 shadow-2xl"
        style={{
          background: "rgba(18,18,18,0.92)",
          border: "1px solid #2a2a2a",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Count badge */}
        <span
          className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
          style={{ background: "#1f1f1f", border: "1px solid #2e2e2e" }}
        >
          {selectedCount}
        </span>
        <span className="text-sm text-white/60">selected</span>

        {hasActiveFilter && (
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            Filtered
          </span>
        )}

        <div className="mx-1 h-4 w-px" style={{ background: "#2a2a2a" }} />

        {/* Export actions */}
        {[
          { label: "CSV", fn: onExportCsv, disabled: false },
          { label: "Excel", fn: onExportExcel, disabled: false },
          { label: "PDFs", fn: onExportZip, disabled: true },
        ].map(({ label, fn, disabled }) => (
          <button
            key={label}
            type="button"
            onClick={fn}
            disabled={disabled}
            title={disabled ? "Coming soon" : undefined}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            <Download size={11} />
            {label}
          </button>
        ))}

        <div className="mx-1 h-4 w-px" style={{ background: "#2a2a2a" }} />

        {/* Deselect */}
        <button
          type="button"
          onClick={onDeselect}
          className="cursor-pointer inline-flex items-center justify-center rounded-full p-1.5 text-white/30 transition-colors hover:bg-white/[0.07] hover:text-white/70"
          aria-label="Clear selection"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
