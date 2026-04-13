"use client";

import { useState } from "react";
import type { AD } from "@/types";
import { Download } from "lucide-react";

interface ExportBarProps {
  selectedIds: Set<string>;
  results: AD[];
}

async function downloadExport(
  format: "csv" | "excel",
  selectedResults: AD[],
) {
  const res = await fetch(`/api/proxy/export/${format}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ results: selectedResults }),
  });

  if (!res.ok) throw new Error(`Export failed: ${res.statusText}`);

  const blob = await res.blob();
  const ext = format === "csv" ? "csv" : "xlsx";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zephr-export.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportBar({ selectedIds, results }: ExportBarProps) {
  const [exporting, setExporting] = useState(false);

  if (selectedIds.size === 0) return null;

  const selectedResults = results.filter((r) => selectedIds.has(r.AD_Number));

  async function handleExport(format: "csv" | "excel") {
    setExporting(true);
    try {
      await downloadExport(format, selectedResults);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  const btn =
    "flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-medium text-[var(--text-1)] transition-colors hover:border-white/20 hover:bg-[var(--surface)] disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <span className="text-sm text-[var(--text-2)]">{selectedIds.size} seleccionados</span>
      <button type="button" onClick={() => handleExport("csv")} disabled={exporting} className={btn}>
        <Download size={12} aria-hidden />
        CSV
      </button>
      <button type="button" onClick={() => handleExport("excel")} disabled={exporting} className={btn}>
        <Download size={12} aria-hidden />
        Excel
      </button>
    </div>
  );
}
