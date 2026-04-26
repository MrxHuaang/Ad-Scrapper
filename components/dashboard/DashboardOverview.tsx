"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bookmark, CheckCircle2, Plane } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { listAircraft } from "@/lib/aircraft/aircraftPersistence";
import { listMySavedAds, listMyReviewedAds } from "@/lib/ads/adPersistence";
import type { ADResult } from "@/types";

function cardCls() {
  return "rounded-2xl border border-white/10 bg-[var(--surface)] p-5";
}

function buildSavedAdHref(row: {
  ad_number: string;
  source: string;
  subject?: string | null;
  pdf_link?: string | null;
  make?: string | null;
  model?: string | null;
  effective_date?: string | null;
  status?: string | null;
  product_type?: string | null;
}) {
  const qs = new URLSearchParams();
  qs.set("source", row.source);
  if (row.pdf_link) qs.set("pdf", row.pdf_link);
  if (row.subject) qs.set("subject", row.subject);
  if (row.make) qs.set("make", row.make);
  if (row.model) qs.set("model", row.model);
  if (row.effective_date) qs.set("effective", row.effective_date);
  if (row.status) qs.set("status", row.status);
  if (row.product_type) qs.set("product", row.product_type);
  return `/ads/${encodeURIComponent(row.ad_number)}?${qs.toString()}`;
}

export function DashboardOverview({ recentResults }: { recentResults: ADResult[] }) {
  const [loading, setLoading] = useState(true);
  const [aircraftCount, setAircraftCount] = useState(0);
  const [saved, setSaved] = useState<Awaited<ReturnType<typeof listMySavedAds>>>([]);
  const [reviewed, setReviewed] = useState<Awaited<ReturnType<typeof listMyReviewedAds>>>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [ac, s, r] = await Promise.all([
          listAircraft(),
          listMySavedAds(),
          listMyReviewedAds(12),
        ]);
        if (cancelled) return;
        setAircraftCount(ac.length);
        setSaved(s.slice(0, 8));
        setReviewed(r);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const recentAds = useMemo(() => {
    // Show the latest N items from current dataset (if any)
    if (!recentResults?.length) return [];
    return recentResults.slice(-8).reverse();
  }, [recentResults]);

  return (
    <div className="pb-24">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={cardCls()}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            <Plane size={14} className="text-white/25" />
            Fleet
          </div>
          <div className="mt-4">
            {loading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight text-white/90">
                {aircraftCount}
              </div>
            )}
            <div className="mt-2 text-[12px] text-white/35">Aircraft in registry</div>
          </div>
          <div className="mt-5">
            <Link
              href="/dashboard/aircraft"
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-white/65 hover:text-white"
            >
              Manage aircraft <ArrowUpRight size={16} className="text-white/30" />
            </Link>
          </div>
        </div>

        <div className={cardCls()}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            <Bookmark size={14} className="text-white/25" />
            Saved ADs
          </div>
          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="mt-2 h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : saved.length === 0 ? (
              <div className="text-sm text-white/40">
                Save an AD to see it here.
              </div>
            ) : (
              saved.map((row) => (
                <Link
                  key={`${row.source}:${row.ad_number}`}
                  href={buildSavedAdHref(row)}
                  className="block cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04]"
                >
                  <div className="font-mono text-[12px] text-white/80">{row.ad_number}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-white/40">
                    {row.subject || "No subject"}
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="mt-5">
            <Link
              href="/dashboard/saved"
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-white/65 hover:text-white"
            >
              View all saved <ArrowUpRight size={16} className="text-white/30" />
            </Link>
          </div>
        </div>

        <div className={cardCls()}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            <CheckCircle2 size={14} className="text-white/25" />
            Reviewed
          </div>
          <div className="mt-4">
            {loading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight text-white/90">
                {reviewed.length}
              </div>
            )}
            <div className="mt-2 text-[12px] text-white/35">Recently reviewed ADs</div>
          </div>
          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-full" />
                ))}
              </div>
            ) : reviewed.length === 0 ? (
              <div className="text-sm text-white/40">Mark an AD as reviewed to track progress.</div>
            ) : (
              reviewed.slice(0, 6).map((r) => (
                <div key={`${r.source}:${r.ad_number}`} className="flex items-center justify-between text-[12px]">
                  <span className="font-mono text-white/70">{r.ad_number}</span>
                  <span className="text-white/25">{r.source}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            Recent ADs (current dataset)
          </div>
          <div className="text-xs text-white/35">{recentAds.length} shown</div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
          {recentAds.length === 0 ? (
            <div className="p-6 text-sm text-white/40">
              Run a search to populate the dashboard with recent ADs.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentAds.map((ad) => (
                <Link
                  key={`${ad.Source}-${ad.AD_Number}`}
                  href={`/ads/${encodeURIComponent(ad.AD_Number)}?source=${encodeURIComponent(ad.Source)}`}
                  className="flex cursor-pointer items-start justify-between gap-4 bg-white/[0.01] p-4 hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[12px] text-white/80">{ad.AD_Number}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-white/40">{ad.Subject || "No subject"}</div>
                  </div>
                  <div className="shrink-0 text-xs text-white/25">{ad.Source || "—"}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

