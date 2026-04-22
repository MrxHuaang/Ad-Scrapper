"use client";

import { useCallback } from "react";
import { FileText, Bookmark, BookmarkCheck, Copy } from "lucide-react";
import type { ADResult } from "@/types";
import { SOURCE_SHORT, normalizeSource, calcRelevance, formatDate, getTypeLabel } from "./searchUtils";
import { showToast } from "@/hooks/useToast";

/* ───── Authority colors ───── */
const SOURCE_COLOR: Record<string, string> = {
  federal_register: "#e8b84b",
  faa:              "#e8b84b",
  easa:             "#e8b84b",
  transport_canada: "#e8b84b",
  anac_brazil:      "#e8b84b",
  anac_argentina:   "#e8b84b",
  dgac_chile:       "#e8b84b",
  aerocivil_colombia: "#e8b84b",
  casa_australia:   "#e8b84b",
  gcaa_uae:         "#e8b84b",
};

interface ADCardProps {
  ad: ADResult;
  isSelected: boolean;
  onToggle: (adNumber: string) => void;
  searchTerm: string;
}

export function ADCard({ ad, isSelected, onToggle, searchTerm }: ADCardProps) {
  const key = normalizeSource(ad.Source);
  const sourceColor = SOURCE_COLOR[key] ?? "#737373";
  const sourceLabel = SOURCE_SHORT[key] ?? ad.Source;
  const rel = calcRelevance(ad, searchTerm);
  const typeLabel = getTypeLabel(ad.Product_Type);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ad.AD_Number);
      showToast("Copied", "success");
    } catch {
      showToast("Could not copy", "error");
    }
  }, [ad.AD_Number]);

  return (
    <div
      className="ad-card group relative flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: isSelected ? "rgba(232,184,75,0.05)" : "rgba(255,255,255,0.025)",
        border: isSelected
          ? "1px solid rgba(232,184,75,0.22)"
          : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Authority color strip — top gradient fade */}
      <div
        className="h-[2px] w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, ${sourceColor} 0%, ${sourceColor}44 60%, transparent 100%)`,
        }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Row 1: Source chip + date */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: sourceColor,
              background: `${sourceColor}18`,
              border: `1px solid ${sourceColor}28`,
            }}
          >
            <span
              className="inline-block h-[5px] w-[5px] shrink-0 rounded-full"
              style={{ background: sourceColor }}
            />
            {sourceLabel}
          </span>

          <div className="flex items-center gap-2">
            {/* Relevance dots */}
            <div className="flex items-center gap-[3px]">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-[5px] w-[5px] rounded-full ${
                    i <= rel ? "bg-white/55" : "bg-white/[0.08]"
                  }`}
                />
              ))}
            </div>
            <span
              className="text-[11px] tabular-nums text-white/30"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatDate(ad.Effective_Date)}
            </span>
          </div>
        </div>

        {/* Row 2: AD Number (hero) */}
        <div className="mb-1 flex items-center gap-2">
          <span className="font-mono text-[1.35rem] font-light leading-none tracking-tight text-white">
            {ad.AD_Number}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="ad-card-actions cursor-pointer rounded p-1 text-white/20 hover:bg-white/[0.07] hover:text-white/60"
            aria-label="Copy AD number"
          >
            <Copy size={12} />
          </button>
        </div>

        {/* Row 3: Make · Model · Type */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[13px]">
          {ad.Make && (
            <span className="font-medium text-white/65">{ad.Make}</span>
          )}
          {ad.Make && ad.Model && (
            <span className="text-white/20">·</span>
          )}
          {ad.Model && (
            <span className="text-white/40">{ad.Model}</span>
          )}
          {typeLabel && (
            <span
              className="rounded px-1.5 py-[2px] text-[10px] font-medium text-white/35"
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
            >
              {typeLabel}
            </span>
          )}
        </div>

        {/* Row 4: Subject */}
        <p className="mb-4 flex-1 text-[0.8125rem] leading-relaxed text-white/50 line-clamp-2">
          {ad.Subject || "No subject provided."}
        </p>

        {/* Row 5: Actions (appear on hover) */}
        <div className="ad-card-actions flex items-center gap-2">
          {ad.PDF_Link && (
            <a
              href={ad.PDF_Link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium text-white/60 transition-all hover:text-white"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <FileText size={12} />
              View PDF
            </a>
          )}

          <button
            type="button"
            onClick={() => onToggle(ad.AD_Number)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all"
            style={
              isSelected
                ? {
                    background: "rgba(232,184,75,0.12)",
                    border: "1px solid rgba(232,184,75,0.25)",
                    color: "#e8b84b",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.45)",
                  }
            }
          >
            {isSelected ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
            {isSelected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
}
