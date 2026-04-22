"use client";

import type { ADResult } from "@/types";
import {
  SOURCE_SHORT,
  normalizeSource,
  calcRelevance,
  formatDate,
  getTypeLabel,
} from "./searchUtils";
import { ExternalLink } from "lucide-react";

interface CardsViewProps {
  results: ADResult[];
  selectedIds: Set<string>;
  onToggleSelect: (adNumber: string) => void;
  searchTerm: string;
}

const SOURCE_COLOR: Record<string, string> = {
  federal_register: "#3b82f6",
  faa:              "#3b82f6",
  easa:             "#f59e0b",
  transport_canada: "#ef4444",
  anac_brazil:      "#10b981",
  anac_argentina:   "#0ea5e9",
  dgac_chile:       "#8b5cf6",
  casa_australia:   "#f97316",
  gcaa_uae:         "#14b8a6",
};

function RelevanceDots({ score }: { score: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-[3px]">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`h-[5px] w-[5px] rounded-full ${i <= score ? "bg-white/60" : "bg-white/[0.08]"}`} />
      ))}
    </div>
  );
}

export function CardsView({ results, selectedIds, onToggleSelect, searchTerm }: CardsViewProps) {
  if (results.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {results.map((ad) => {
        const isSelected = selectedIds.has(ad.AD_Number);
        const rel = calcRelevance(ad, searchTerm);
        const typeLabel = getTypeLabel(ad.Product_Type);
        const key = normalizeSource(ad.Source);
        const sourceColor = SOURCE_COLOR[key] ?? "#737373";
        const label = SOURCE_SHORT[key] ?? ad.Source;

        return (
          <div
            key={ad.AD_Number}
            className="group overflow-hidden rounded-xl transition-all"
            style={{
              background: isSelected ? "#141414" : "#0d0d0d",
              border: `1px solid ${isSelected ? "#252525" : "#1a1a1a"}`,
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.background = "#111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isSelected ? "#141414" : "#0d0d0d";
            }}
          >
            {/* Color header strip */}
            <div className="h-[3px] w-full" style={{ background: sourceColor }} />

            <div className="p-4">
              {/* Top: source + rel + checkbox */}
              <div className="mb-3 flex items-start justify-between">
                <span
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: sourceColor,
                    background: `${sourceColor}18`,
                    border: `1px solid ${sourceColor}22`,
                  }}
                >
                  <span className="inline-block h-[5px] w-[5px] rounded-full" style={{ background: sourceColor }} />
                  {label}
                </span>
                <div className="flex items-center gap-2.5">
                  <RelevanceDots score={rel} />
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(ad.AD_Number)}
                    className="h-3.5 w-3.5 cursor-pointer accent-white/80"
                  />
                </div>
              </div>

              {/* AD Number */}
              <div className="mb-1 font-mono text-[0.875rem] font-semibold tracking-tight text-white">
                {ad.AD_Number}
              </div>

              {/* Make · Model · Type */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[12px]">
                {ad.Make && <span className="font-medium text-white/70">{ad.Make}</span>}
                {ad.Make && ad.Model && <span className="text-white/20">·</span>}
                {ad.Model && <span className="text-white/40">{ad.Model}</span>}
                {typeLabel && (
                  <span
                    className="inline-flex items-center rounded px-1.5 py-[2px] text-[10px] font-medium text-white/35"
                    style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                  >
                    {typeLabel}
                  </span>
                )}
              </div>

              {/* Subject */}
              <p className="mb-4 line-clamp-2 text-[0.8125rem] leading-relaxed text-white/50">
                {ad.Subject || "—"}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] tabular-nums text-white/30">
                  {formatDate(ad.Effective_Date)}
                </span>
                {ad.PDF_Link ? (
                  <a
                    href={ad.PDF_Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-white/50 backdrop-blur-sm transition-all hover:text-white"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    View PDF <ExternalLink size={10} />
                  </a>
                ) : (
                  <span className="text-[11px] text-white/20">No link</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
