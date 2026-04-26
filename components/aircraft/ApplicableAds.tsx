"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AircraftRow } from "@/lib/aircraft/aircraftPersistence";
import type { ADResult } from "@/types";
import { listMySavedAds } from "@/lib/ads/adPersistence";
import { showToast } from "@/hooks/useToast";

const SESSION_KEY = "zephr_session";

function normalize(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function includesEitherWay(a: string, b: string) {
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
}

function matchScore(aircraft: AircraftRow, ad: ADResult) {
  const am = normalize(aircraft.make || "");
  const aModel = normalize(aircraft.model || "");
  const m = normalize(ad.Make || "");
  const model = normalize(ad.Model || "");

  let score = 0;
  if (am && m && includesEitherWay(am, m)) score += 2;
  if (aModel && model && includesEitherWay(aModel, model)) score += 2;

  // Small bump if subject mentions model tokens
  const subj = normalize(ad.Subject || "");
  if (aModel && subj && subj.includes(aModel)) score += 1;

  return score;
}

function buildAdHref(ad: ADResult) {
  const qs = new URLSearchParams();
  if (ad.Source) qs.set("source", ad.Source);
  if (ad.PDF_Link) qs.set("pdf", ad.PDF_Link);
  if (ad.Subject) qs.set("subject", ad.Subject);
  if (ad.Make) qs.set("make", ad.Make);
  if (ad.Model) qs.set("model", ad.Model);
  if (ad.Effective_Date) qs.set("effective", ad.Effective_Date);
  if (ad.Status) qs.set("status", ad.Status);
  if (ad.Product_Type) qs.set("product", ad.Product_Type);
  return `/ads/${encodeURIComponent(ad.AD_Number)}?${qs.toString()}`;
}

export function ApplicableAds({
  aircraft,
  loading,
}: {
  aircraft: AircraftRow | null;
  loading: boolean;
}) {
  const [adsLoading, setAdsLoading] = useState(true);
  const [ads, setAds] = useState<ADResult[]>([]);

  useEffect(() => {
    let cancelled = false;
    // Avoid an infinite skeleton when no aircraft is selected yet.
    if (!aircraft) {
      setAds([]);
      setAdsLoading(false);
      return;
    }
    if (loading) {
      setAdsLoading(true);
      return;
    }

    setAdsLoading(true);
    (async () => {
      try {
        // 1) Try last search dataset from sessionStorage
        let candidates: ADResult[] = [];
        try {
          const raw = sessionStorage.getItem(SESSION_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as { results?: ADResult[] };
            if (Array.isArray(parsed?.results)) candidates = parsed.results;
          }
        } catch {
          // ignore
        }

        // 2) Fallback to saved ADs snapshot
        if (candidates.length === 0) {
          const saved = await listMySavedAds();
          candidates = saved.map((r) => ({
            AD_Number: r.ad_number,
            Source: r.source,
            Subject: r.subject ?? "",
            Make: r.make ?? "",
            Model: r.model ?? "",
            Effective_Date: r.effective_date ?? "",
            Status: r.status ?? "",
            Product_Type: r.product_type ?? "",
            Docket: "",
            PDF_Link: r.pdf_link ?? "",
          }));
        }

        const scored = candidates
          .map((ad) => ({ ad, score: matchScore(aircraft, ad) }))
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 30)
          .map((x) => x.ad);

        if (!cancelled) setAds(scored);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Could not load applicable ADs";
        showToast(msg, "error");
      } finally {
        if (!cancelled) setAdsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [aircraft, loading]);

  const headerRight = useMemo(() => {
    if (loading || adsLoading) return <Skeleton as="span" className="h-3 w-16" />;
    return <div className="text-xs text-white/35">{ads.length} matches</div>;
  }, [ads.length, adsLoading, loading]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            <Sparkles size={14} className="text-white/25" />
            Applicable ADs
          </div>
          <p className="mt-2 text-sm text-white/35">
            Matched by make/model (MVP). Upgrade matching rules in the next iteration.
          </p>
        </div>
        {headerRight}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
        {loading || adsLoading ? (
          <div className="p-4">
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="mt-2 h-3 w-full" />
                    <Skeleton className="mt-1 h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        ) : ads.length === 0 ? (
          <div className="p-6 text-sm text-white/40">
            No matches yet. Add make/model to the aircraft, or run a search to enrich the dataset.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {ads.map((ad) => (
              <Link
                key={`${ad.Source}-${ad.AD_Number}`}
                href={buildAdHref(ad)}
                className="group flex cursor-pointer items-start justify-between gap-4 bg-white/[0.01] p-4 hover:bg-white/[0.03]"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm text-white/85">{ad.AD_Number}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/45">
                    {ad.Subject || "No subject"}
                  </p>
                  <p className="mt-2 text-[11px] text-white/30">
                    {(ad.Source || "—") +
                      (ad.Make ? ` · ${ad.Make}` : "") +
                      (ad.Model ? ` · ${ad.Model}` : "") +
                      (ad.Effective_Date ? ` · Effective ${ad.Effective_Date}` : "")}
                  </p>
                </div>
                <div className="shrink-0 text-xs text-white/25 group-hover:text-white/45">
                  Open <ArrowUpRight size={14} className="inline-block -translate-y-[1px]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

