"use client";

import { useMemo } from "react";
import type { ADResult } from "@/types";
import { SOURCE_SHORT, normalizeSource } from "@/components/search/searchUtils";

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function formatPct(v: number) {
  return `${Math.round(v * 10) / 10}%`;
}

function parseYmd(d: string | undefined): Date | null {
  if (!d) return null;
  // Expecting YYYY-MM-DD; fall back to Date parsing if needed.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const fallback = new Date(d);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function RightRail({
  results,
  configuredAuthorities,
}: {
  results: ADResult[];
  configuredAuthorities: string[];
}) {
  const coverage = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of results) {
      const key = normalizeSource(r.Source);
      const short = SOURCE_SHORT[key] ?? key;
      counts[short] = (counts[short] ?? 0) + 1;
    }
    const present = Object.keys(counts);
    const pct =
      configuredAuthorities.length > 0
        ? clamp01(present.length / configuredAuthorities.length) * 100
        : 0;
    return { counts, present, pct };
  }, [results, configuredAuthorities]);

  const productTypes = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of results) {
      const k = (r.Product_Type || "Unknown").trim() || "Unknown";
      counts[k] = (counts[k] ?? 0) + 1;
    }
    const total = results.length || 1;
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value, pct: (value / total) * 100 }));
    return sorted;
  }, [results]);

  const activity = useMemo(() => {
    // Lightweight “activity”: take the latest N results and show source + effective date.
    const last = results.slice(-8).reverse();
    return last.map((r) => {
      const key = normalizeSource(r.Source);
      const short = SOURCE_SHORT[key] ?? key;
      const d = parseYmd(r.Effective_Date);
      const when = d
        ? d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })
        : "—";
      return {
        id: `${r.Source}-${r.AD_Number}`,
        title: r.AD_Number,
        subtitle: r.Subject || "New record indexed",
        meta: `${short} · ${when}`,
      };
    });
  }, [results]);

  const allAuthoritiesLabel = useMemo(() => {
    // Show configured authorities list only when there are no results.
    return configuredAuthorities.length > 0
      ? configuredAuthorities.join(" · ")
      : "—";
  }, [configuredAuthorities]);

  return (
    <aside className="hidden w-[380px] shrink-0 border-l border-white/5 bg-[var(--surface)] lg:block">
      <div className="h-full overflow-y-auto px-5 py-6">
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            Live activity
          </h3>
          <div className="mt-4 space-y-3">
            {activity.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm text-white/35">
                Run a search to see live activity.
                <div className="mt-2 text-[11px] text-white/20">
                  Authorities: {allAuthoritiesLabel}
                </div>
              </div>
            ) : (
              activity.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/85">
                        {a.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-white/35">
                        {a.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-white/25">{a.meta}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            Coverage
          </h3>
          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-white/85">Authorities</p>
              <p className="text-sm font-semibold text-white/60">
                {coverage.present.length}/{configuredAuthorities.length}
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${coverage.pct}%`,
                  background:
                    "linear-gradient(90deg, color-mix(in srgb, var(--zl-spectrum-from) 55%, transparent), color-mix(in srgb, var(--zl-spectrum-to) 55%, transparent))",
                }}
              />
            </div>
            <p className="mt-2 text-[11px] text-white/25">
              Global coverage: <span className="text-white/45">{formatPct(coverage.pct)}</span>
            </p>

            <div className="mt-4 space-y-2">
              {Object.entries(coverage.counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[12px]">
                    <span className="text-white/40">{k}</span>
                    <span className="tabular-nums text-white/55">{v.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            AD types
          </h3>
          <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            {productTypes.length === 0 ? (
              <p className="text-sm text-white/35">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {productTypes.map((t) => (
                  <div key={t.label} className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-white/20"
                        style={{ width: `${t.pct}%` }}
                      />
                    </div>
                    <div className="w-[120px] truncate text-[12px] text-white/35">
                      {t.label}
                    </div>
                    <div className="w-12 text-right text-[12px] tabular-nums text-white/55">
                      {Math.round(t.pct)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

