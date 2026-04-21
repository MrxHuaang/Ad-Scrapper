"use client";

import type { ADResult } from "@/types";
import {
  BADGE_STYLES,
  SOURCE_SHORT,
  normalizeSource,
  calcRelevance,
  formatDate,
  getTypeLabel,
} from "./searchUtils";

/* ───── Interfaces ───── */
interface CardsViewProps {
  results: ADResult[];
  selectedIds: Set<string>;
  onToggleSelect: (adNumber: string) => void;
  searchTerm: string;
}

/* ───── Sub-components ───── */

function RelevanceBars({ score }: { score: 1 | 2 | 3 }) {
  return (
    <div className="flex items-end gap-[2px]">
      {[8, 11, 14].map((h, i) => (
        <div
          key={i}
          style={{ height: h }}
          className={`w-[4px] rounded-sm ${i < score ? "bg-[var(--text-2)]" : "bg-[var(--border)]"}`}
        />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const key = normalizeSource(source);
  const style =
    BADGE_STYLES[key] ??
    "bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)]";
  const label = SOURCE_SHORT[key] ?? source;
  return (
    <span
      className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style}`}
    >
      {label}
    </span>
  );
}

/* ───── Main Component ───── */
export function CardsView({
  results,
  selectedIds,
  onToggleSelect,
  searchTerm,
}: CardsViewProps) {
  if (results.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {results.map((ad) => {
        const isSelected = selectedIds.has(ad.AD_Number);
        const rel = calcRelevance(ad, searchTerm);
        const typeLabel = getTypeLabel(ad.Product_Type);

        return (
          <div
            key={ad.AD_Number}
            className={`rounded-lg border p-3.5 transition-colors ${
              isSelected
                ? "border-[var(--accent)]/30 bg-[var(--accent)]/[0.05]"
                : "border-[var(--border)] hover:border-[var(--border-strong)]"
            }`}
          >
            {/* Top row: source + checkbox/relevance */}
            <div className="mb-2 flex items-start justify-between">
              <SourceBadge source={ad.Source} />
              <div className="flex items-center gap-2">
                <RelevanceBars score={rel} />
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(ad.AD_Number)}
                  className="accent-[var(--accent)]"
                />
              </div>
            </div>

            {/* AD Number */}
            <div className="mb-1 font-mono text-sm font-semibold text-[var(--text-1)]">
              {ad.AD_Number}
            </div>

            {/* Make · Model · Type */}
            <div className="mb-2 flex items-center gap-1 text-xs text-[var(--text-2)]">
              {ad.Make && <span>{ad.Make}</span>}
              {ad.Make && ad.Model && <span>·</span>}
              {ad.Model && <span>{ad.Model}</span>}
              {typeLabel && (
                <span className="ml-1 rounded border border-[var(--border)] bg-[var(--surface-2)] px-1 py-0.5 text-[10px] font-medium">
                  {typeLabel}
                </span>
              )}
            </div>

            {/* Subject */}
            <div className="mb-3 text-sm leading-relaxed text-[var(--text-1)]">
              {ad.Subject || "—"}
            </div>

            {/* Bottom: date + PDF link */}
            <div className="flex items-center justify-between">
              <span
                className="text-xs text-[var(--text-3)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatDate(ad.Effective_Date)}
              </span>
              {ad.PDF_Link ? (
                <a
                  href={ad.PDF_Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[var(--accent)] underline underline-offset-2 hover:text-white"
                >
                  View PDF
                </a>
              ) : (
                <span className="text-xs text-[var(--text-3)]">
                  No link
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
