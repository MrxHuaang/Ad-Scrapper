"use client";

import type { AD } from "@/types";
import { cn } from "@/lib/utils";

interface ResultsTableProps {
  results: AD[];
  selectedIds: Set<string>;
  onToggleSelect: (adNumber: string) => void;
  onSelectAll: () => void;
}

function sourceBadgeClass(source: string) {
  const u = source.toUpperCase();
  if (u.includes("FEDERAL") || u.includes("FAA"))
    return "border border-blue-500/30 bg-blue-500/15 text-blue-300";
  if (u.includes("EASA"))
    return "border border-cyan-500/30 bg-cyan-500/15 text-cyan-300";
  if (u.includes("CANADA") || u.includes("TRANSPORT"))
    return "border border-red-500/30 bg-red-500/15 text-red-300";
  if (u.includes("ANAC"))
    return "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
  return "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)]";
}

export function ResultsTable({
  results,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}: ResultsTableProps) {
  if (results.length === 0) return null;

  const allSelected =
    results.length > 0 && results.every((r) => selectedIds.has(r.AD_Number));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border)]">
          <tr>
            <th className="w-10 px-3 py-2">
              <input type="checkbox" checked={allSelected} onChange={onSelectAll} className="accent-[var(--accent)]" />
            </th>
            <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-2)]">Fuente</th>
            <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-2)]">N.º AD</th>
            <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-2)]">Fabricante</th>
            <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-2)]">Modelo</th>
            <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-2)]">Asunto</th>
            <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-2)]">Fecha</th>
            <th className="w-16 px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-2)]">PDF</th>
          </tr>
        </thead>
        <tbody>
          {results.map((ad) => (
            <tr key={ad.AD_Number} className="border-b border-[var(--border)] transition-colors hover:bg-[var(--surface)]">
              <td className="px-3 py-2">
                <input type="checkbox" checked={selectedIds.has(ad.AD_Number)} onChange={() => onToggleSelect(ad.AD_Number)} className="accent-[var(--accent)]" />
              </td>
              <td className="whitespace-nowrap px-3 py-2">
                <span className={cn("inline-block rounded px-2 py-0.5 text-xs", sourceBadgeClass(ad.Source))}>{ad.Source}</span>
              </td>
              <td className="whitespace-nowrap px-3 py-2 font-mono text-white">{ad.AD_Number}</td>
              <td className="whitespace-nowrap px-3 py-2 text-[var(--text-1)]">{ad.Make}</td>
              <td className="whitespace-nowrap px-3 py-2 text-[var(--text-1)]">{ad.Model}</td>
              <td className="max-w-xs truncate px-3 py-2 text-[var(--text-2)]">{ad.Subject}</td>
              <td className="whitespace-nowrap px-3 py-2 text-[var(--text-2)]">{ad.Effective_Date}</td>
              <td className="px-3 py-2">
                {ad.PDF_Link && (
                  <a href={ad.PDF_Link} target="_blank" rel="noopener noreferrer" className="text-[var(--text-2)] underline underline-offset-2 hover:text-white">
                    PDF
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
