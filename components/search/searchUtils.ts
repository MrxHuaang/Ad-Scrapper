import type { ADResult } from "@/types";

/* ───── Source Badge styles & short labels ───── */
export const BADGE_STYLES: Record<string, string> = {
  federal_register: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  easa: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  transport_canada: "bg-red-500/10 text-red-300 border-red-500/20",
  anac_brazil: "bg-green-500/10 text-green-300 border-green-500/20",
  anac_argentina: "bg-blue-400/10 text-blue-200 border-blue-400/20",
  dgac_chile: "bg-red-400/10 text-red-200 border-red-400/20",
  aerocivil_colombia: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  casa_australia: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  gcaa_uae: "bg-yellow-600/10 text-yellow-200 border-yellow-600/20",
};

export const SOURCE_SHORT: Record<string, string> = {
  federal_register: "FAA",
  easa: "EASA",
  transport_canada: "TC",
  anac_brazil: "ANAC",
  anac_argentina: "ARG",
  dgac_chile: "DGAC",
  aerocivil_colombia: "COL",
  casa_australia: "CASA",
  gcaa_uae: "UAE",
};

/** Normalize the raw Source field to a key like "federal_register" */
export function normalizeSource(raw: string): string {
  return raw.toLowerCase().replace(/[\s-]+/g, "_");
}

/* ───── Type badge ───── */
export const TYPE_LABELS: Record<string, string> = {
  aircraft: "Aircraft",
  engine: "Engine",
  propeller: "Propeller",
};

export function getTypeLabel(type: string | undefined): string | null {
  if (!type) return null;
  return TYPE_LABELS[type.toLowerCase()] ?? null;
}

/* ───── Date formatting ───── */
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(raw: string | undefined): string {
  if (!raw) return "—";
  // Try ISO or common date format
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ───── Relevance ───── */
export function calcRelevance(r: ADResult, term: string): 1 | 2 | 3 {
  if (!term) return 1;
  const t = term.toLowerCase();
  const adNum = r.AD_Number?.toLowerCase() ?? "";
  const subjectWords = (r.Subject ?? "")
    .toLowerCase()
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");
  const subjectFull = r.Subject?.toLowerCase() ?? "";
  if (adNum.includes(t) || subjectWords.includes(t)) return 3;
  if (subjectFull.includes(t)) return 2;
  return 1;
}

/* ───── Sorting ───── */
export function getSortedResults(
  arr: ADResult[],
  sortField: string,
  sortOrder: "asc" | "desc",
  searchTerm: string,
): ADResult[] {
  return [...arr].sort((a, b) => {
    if (sortField === "_relevance") {
      const diff = calcRelevance(b, searchTerm) - calcRelevance(a, searchTerm);
      return sortOrder === "desc" ? diff : -diff;
    }
    const va = String(
      a[sortField as keyof ADResult] ?? "",
    ).toLowerCase();
    const vb = String(
      b[sortField as keyof ADResult] ?? "",
    ).toLowerCase();
    return sortOrder === "asc"
      ? va.localeCompare(vb)
      : vb.localeCompare(va);
  });
}
