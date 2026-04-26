"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { listAircraft } from "@/lib/aircraft/aircraftPersistence";
import type { AircraftRow } from "@/lib/aircraft/aircraftPersistence";
import { showToast } from "@/hooks/useToast";

function formatLine(ac: AircraftRow) {
  const parts = [ac.make, ac.model].map((s) => (s || "").trim()).filter(Boolean);
  if (parts.length === 0) return "—";
  return parts.join(" · ");
}

export function AircraftList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AircraftRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const rows = await listAircraft();
        if (!cancelled) setItems(rows);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Could not load aircraft";
        showToast(msg, "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const countLabel = useMemo(() => {
    if (loading) return null;
    return `${items.length} aircraft`;
  }, [items.length, loading]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-white">Aircraft</h1>
          <p className="mt-2 text-sm text-white/35">
            Manage your fleet registry and see applicable directives.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {countLabel ? <div className="text-xs text-white/35">{countLabel}</div> : null}
          <Link
            href="/aircraft/new"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.06]"
          >
            <Plus size={16} />
            Add aircraft
          </Link>
        </div>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            Registry
          </div>
          {loading ? <Skeleton as="span" className="h-3 w-20" /> : null}
        </div>

        {loading ? (
          <div className="p-5">
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="mt-2 h-3 w-3/4" />
                    <Skeleton className="mt-1 h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/60">
              <Plus size={18} />
            </div>
            <p className="text-sm font-semibold text-white/80">Add your first aircraft</p>
            <p className="mt-2 text-sm text-white/35">
              Create an aircraft record to start matching applicable ADs.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/aircraft/new"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.06]"
              >
                Add aircraft
                <ArrowUpRight size={16} className="text-white/45" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((ac) => (
              <Link
                key={ac.id}
                href={`/aircraft/${ac.id}`}
                className="group flex cursor-pointer items-start justify-between gap-4 px-5 py-4 hover:bg-white/[0.03]"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm text-white/85">{ac.registration}</p>
                  <p className="mt-1 truncate text-sm text-white/45">{formatLine(ac)}</p>
                  <p className="mt-2 text-[11px] text-white/30">
                    Serial: {ac.serial?.trim() ? ac.serial : "—"}
                  </p>
                </div>
                <div className="shrink-0 text-xs text-white/25 group-hover:text-white/45">
                  Open →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

