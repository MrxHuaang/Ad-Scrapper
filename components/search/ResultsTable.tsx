"use client";

import { useCallback, useRef, useEffect } from "react";
import type { ADResult } from "@/types";
import {
  SOURCE_SHORT,
  normalizeSource,
  calcRelevance,
  formatDate,
  getTypeLabel,
} from "./searchUtils";
import { showToast } from "@/hooks/useToast";
import { Copy, ExternalLink } from "lucide-react";

/* ───── Interfaces ───── */
interface ResultsTableProps {
  results: ADResult[];
  selectedIds: Set<string>;
  onToggleSelect: (adNumber: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  searchTerm: string;
}

/* ───── Authority color palette ───── */
const SOURCE_COLOR: Record<string, string> = {
  federal_register: "#e8b84b",
  faa:              "#e8b84b",
  easa:             "#e8b84b",
  transport_canada: "#e8b84b",
  anac_brazil:      "#e8b84b",
  anac_argentina:   "#e8b84b",
  dgac_chile:       "#e8b84b",
  casa_australia:   "#e8b84b",
  gcaa_uae:         "#e8b84b",
};

const SOURCE_BG: Record<string, string> = {
  federal_register: "rgba(232,184,75,0.12)",
  faa:              "rgba(232,184,75,0.12)",
  easa:             "rgba(232,184,75,0.12)",
  transport_canada: "rgba(232,184,75,0.12)",
  anac_brazil:      "rgba(232,184,75,0.12)",
  anac_argentina:   "rgba(232,184,75,0.12)",
  dgac_chile:       "rgba(232,184,75,0.12)",
  casa_australia:   "rgba(232,184,75,0.12)",
  gcaa_uae:         "rgba(232,184,75,0.12)",
};

/* ───── Sub-components ───── */
function RelevanceDots({ score }: { score: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-[3px]">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-[5px] w-[5px] rounded-full ${
            i <= score ? "bg-white/60" : "bg-white/[0.08]"
          }`}
        />
      ))}
    </div>
  );
}

function SourceChip({ source }: { source: string }) {
  const key = normalizeSource(source);
  const color = SOURCE_COLOR[key] ?? "#737373";
  const bg = SOURCE_BG[key] ?? "rgba(255,255,255,0.06)";
  const label = SOURCE_SHORT[key] ?? source;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[10px] font-bold uppercase tracking-wider"
      style={{ color, background: bg, border: `1px solid ${color}22` }}
    >
      <span
        className="inline-block h-[5px] w-[5px] rounded-full shrink-0"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function SortHeader({
  field, label, currentField, currentOrder, onSort, className,
}: {
  field: string; label: string; currentField: string;
  currentOrder: "asc" | "desc"; onSort: (f: string) => void; className?: string;
}) {
  const isActive = currentField === field;
  return (
    <th
      onClick={() => onSort(field)}
      className={`cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest transition-colors ${
        isActive ? "text-white/80" : "text-white/30 hover:text-white/60"
      } ${className ?? ""}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        {isActive && <span>{currentOrder === "asc" ? "↑" : "↓"}</span>}
      </span>
    </th>
  );
}

function CopyButton({ text }: { text: string }) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied", "success");
    } catch {
      showToast("Could not copy", "error");
    }
  }, [text]);
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1 inline-flex cursor-pointer items-center rounded p-[3px] text-white/20 opacity-0 transition-all group-hover/row:opacity-100 hover:bg-white/[0.07] hover:text-white/70"
      aria-label="Copy"
    >
      <Copy size={10} />
    </button>
  );
}

/* ───── Main Table ───── */
export function ResultsTable({
  results, selectedIds, onToggleSelect, sortField, sortOrder, onSort, searchTerm,
}: ResultsTableProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);
  if (results.length === 0) return null;

  const allSelected = results.every((r) => selectedIds.has(r.AD_Number));
  const someSelected = !allSelected && results.some((r) => selectedIds.has(r.AD_Number));

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  function handleSelectAll() {
    if (allSelected) results.forEach((r) => onToggleSelect(r.AD_Number));
    else results.filter((r) => !selectedIds.has(r.AD_Number)).forEach((r) => onToggleSelect(r.AD_Number));
  }

  return (
    <div className="overflow-hidden rounded-xl" style={{ border: "1px solid #1e1e1e", background: "#0a0a0a" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">

          {/* ── Header ── */}
          <thead>
            <tr style={{ background: "#131313", borderBottom: "1px solid #1e1e1e" }}>
              {/* Select-all */}
              <th className="w-10 px-4 py-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="h-3.5 w-3.5 cursor-pointer accent-white/80"
                />
              </th>
              {/* Source stripe placeholder */}
              <th className="w-1 p-0" />
              <SortHeader field="_relevance"   label="Rel"      currentField={sortField} currentOrder={sortOrder} onSort={onSort} className="w-12" />
              <SortHeader field="Source"        label="Source"   currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <SortHeader field="AD_Number"     label="AD #"     currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <SortHeader field="Make"          label="Aircraft" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <SortHeader field="Subject"       label="Subject"  currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <SortHeader field="Effective_Date" label="Date"    currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-white/30">Type</th>
              <th className="w-24 px-4 py-3" />
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {results.map((ad) => {
              const isSelected = selectedIds.has(ad.AD_Number);
              const rel = calcRelevance(ad, searchTerm);
              const typeLabel = getTypeLabel(ad.Product_Type);
              const key = normalizeSource(ad.Source);
              const sourceColor = SOURCE_COLOR[key] ?? "#737373";

              return (
                <tr
                  key={ad.AD_Number}
                  className="group/row transition-colors"
                  style={{
                    background: isSelected ? "#141414" : undefined,
                    borderBottom: "1px solid #141414",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#111111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isSelected ? "#141414" : "";
                  }}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(ad.AD_Number)}
                      className="h-3.5 w-3.5 cursor-pointer accent-white/80"
                    />
                  </td>

                  {/* Source color stripe */}
                  <td className="w-1 p-0">
                    <div className="h-full w-[3px] min-h-[52px]" style={{ background: sourceColor }} />
                  </td>

                  {/* Relevance */}
                  <td className="px-4 py-3.5">
                    <RelevanceDots score={rel} />
                  </td>

                  {/* Source chip */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <SourceChip source={ad.Source} />
                  </td>

                  {/* AD Number */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center">
                      <span className="font-mono text-[0.8125rem] font-semibold tracking-tight text-white">
                        {ad.AD_Number}
                      </span>
                      <CopyButton text={ad.AD_Number} />
                    </div>
                  </td>

                  {/* Aircraft */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[0.8125rem] font-medium text-white/85">{ad.Make || "—"}</span>
                      {ad.Model && <span className="text-[11px] text-white/35">{ad.Model}</span>}
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="max-w-[360px] px-4 py-3.5">
                    <span className="line-clamp-1 text-[0.8125rem] text-white/55" title={ad.Subject}>
                      {ad.Subject || "—"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="text-[0.8125rem] tabular-nums text-white/35">
                      {formatDate(ad.Effective_Date)}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    {typeLabel ? (
                      <span
                        className="inline-flex items-center rounded-md px-2 py-[3px] text-[10px] font-medium text-white/40"
                        style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                      >
                        {typeLabel}
                      </span>
                    ) : (
                      <span className="text-white/15">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    {ad.PDF_Link ? (
                      <a
                        href={ad.PDF_Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-white/50 opacity-0 backdrop-blur-sm transition-all group-hover/row:opacity-100 hover:text-white"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        View <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-[11px] text-white/15">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
