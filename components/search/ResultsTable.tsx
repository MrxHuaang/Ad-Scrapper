"use client";

import { useCallback, useRef, useState } from "react";
import type { ADResult } from "@/types";
import {
  BADGE_STYLES,
  SOURCE_SHORT,
  normalizeSource,
  calcRelevance,
  formatDate,
  getTypeLabel,
} from "./searchUtils";
import { showToast } from "@/hooks/useToast";
import { Copy } from "lucide-react";

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

/* ───── Sortable column config ───── */
const SORTABLE_FIELDS: Record<string, string> = {
  _relevance: "Rel",
  Source: "Source",
  AD_Number: "AD #",
  Make: "Make",
  Model: "Model",
  Subject: "Subject",
  Effective_Date: "Date",
};

/* ───── Components ───── */

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
  const style = BADGE_STYLES[key] ?? "bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)]";
  const label = SOURCE_SHORT[key] ?? source;
  return (
    <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style}`}>
      {label}
    </span>
  );
}

function SortHeader({
  field,
  label,
  currentField,
  currentOrder,
  onSort,
  className,
}: {
  field: string;
  label: string;
  currentField: string;
  currentOrder: "asc" | "desc";
  onSort: (f: string) => void;
  className?: string;
}) {
  const isActive = currentField === field;
  return (
    <th
      className={`cursor-pointer select-none px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-3)] transition-colors hover:text-[var(--text-2)] ${className ?? ""}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <span className="text-[var(--text-2)]">
            {currentOrder === "asc" ? "↑" : "↓"}
          </span>
        )}
      </span>
    </th>
  );
}

function CopyButton({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied", "success");
      setShow(false);
    } catch {
      showToast("Could not copy", "error");
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="ml-1 inline-flex items-center rounded p-0.5 text-[var(--text-3)] opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-[var(--text-1)]"
      aria-label="Copy AD number"
    >
      <Copy size={12} />
    </button>
  );
}

/* ───── Main Table ───── */
export function ResultsTable({
  results,
  selectedIds,
  onToggleSelect,
  sortField,
  sortOrder,
  onSort,
  searchTerm,
}: ResultsTableProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  if (results.length === 0) return null;

  const allSelected =
    results.length > 0 && results.every((r) => selectedIds.has(r.AD_Number));
  const someSelected =
    !allSelected && results.some((r) => selectedIds.has(r.AD_Number));

  // Set indeterminate via ref
  if (selectAllRef.current) {
    selectAllRef.current.indeterminate = someSelected;
  }

  function handleSelectAll() {
    if (allSelected) {
      results.forEach((r) => onToggleSelect(r.AD_Number));
    } else {
      results
        .filter((r) => !selectedIds.has(r.AD_Number))
        .forEach((r) => onToggleSelect(r.AD_Number));
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--surface)]">
          <tr>
            {/* Checkbox */}
            <th className="w-9 px-3 py-2">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="accent-[var(--accent)]"
              />
            </th>
            {/* Relevance */}
            <SortHeader
              field="_relevance"
              label="Rel"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={onSort}
              className="w-[50px]"
            />
            {/* Source */}
            <SortHeader
              field="Source"
              label="Source"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={onSort}
            />
            {/* AD Number */}
            <SortHeader
              field="AD_Number"
              label="N.º AD"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={onSort}
            />
            {/* Make */}
            <SortHeader
              field="Make"
              label="Make"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={onSort}
            />
            {/* Model */}
            <SortHeader
              field="Model"
              label="Modelo"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={onSort}
            />
            {/* Type */}
            <th className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-3)]">
              Type
            </th>
            {/* Subject */}
            <SortHeader
              field="Subject"
              label="Subject"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={onSort}
            />
            {/* Date */}
            <SortHeader
              field="Effective_Date"
              label="Date"
              currentField={sortField}
              currentOrder={sortOrder}
              onSort={onSort}
            />
            {/* Link */}
            <th className="w-16 px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--text-3)]">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((ad) => {
            const isSelected = selectedIds.has(ad.AD_Number);
            const rel = calcRelevance(ad, searchTerm);
            const typeLabel = getTypeLabel(ad.Product_Type);
            const subjectWords = (ad.Subject ?? "").split(/\s+/);
            const subjectFirst2 = subjectWords.slice(0, 2).join(" ");
            const subjectRest = subjectWords.slice(2).join(" ");

            return (
              <tr
                key={ad.AD_Number}
                className={`group/row border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)] ${isSelected ? "bg-[var(--accent)]/[0.08]" : ""}`}
              >
                {/* Checkbox */}
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(ad.AD_Number)}
                    className="accent-[var(--accent)]"
                  />
                </td>
                {/* Relevance */}
                <td className="px-3 py-2">
                  <RelevanceBars score={rel} />
                </td>
                {/* Source */}
                <td className="whitespace-nowrap px-3 py-2">
                  <SourceBadge source={ad.Source} />
                </td>
                {/* AD Number */}
                <td className="whitespace-nowrap px-3 py-2">
                  <span className="font-mono text-[0.75rem] font-bold text-[var(--text-1)]">
                    {ad.AD_Number}
                  </span>
                  <CopyButton text={ad.AD_Number} />
                </td>
                {/* Make */}
                <td className="whitespace-nowrap px-3 py-2 text-[var(--text-1)]">
                  {ad.Make}
                </td>
                {/* Model */}
                <td className="whitespace-nowrap px-3 py-2 text-[var(--text-1)]">
                  {ad.Model}
                </td>
                {/* Type */}
                <td className="whitespace-nowrap px-3 py-2">
                  {typeLabel ? (
                    <span className="rounded border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-2)]">
                      {typeLabel}
                    </span>
                  ) : (
                    <span className="text-[var(--text-3)]">—</span>
                  )}
                </td>
                {/* Subject */}
                <td
                  className="max-w-[380px] truncate px-3 py-2 text-sm"
                  title={ad.Subject}
                >
                  <span className="text-[var(--text-1)]">{subjectFirst2}</span>
                  {subjectRest && (
                    <span className="text-[var(--text-2)]"> {subjectRest}</span>
                  )}
                </td>
                {/* Date */}
                <td className="whitespace-nowrap px-3 py-2 text-[var(--text-2)]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatDate(ad.Effective_Date)}
                </td>
                {/* Link */}
                <td className="px-3 py-2">
                  {ad.PDF_Link ? (
                    <a
                      href={ad.PDF_Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[var(--accent)] underline underline-offset-2 hover:text-white"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-[var(--text-3)]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
