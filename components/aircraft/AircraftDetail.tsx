"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getAircraft } from "@/lib/aircraft/aircraftPersistence";
import type { AircraftRow } from "@/lib/aircraft/aircraftPersistence";
import { showToast } from "@/hooks/useToast";
import { ApplicableAds } from "@/components/aircraft/ApplicableAds";

export function AircraftDetail({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [aircraft, setAircraft] = useState<AircraftRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const row = await getAircraft(id);
        if (!cancelled) setAircraft(row);
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
  }, [id]);

  const headline = useMemo(() => {
    if (loading) return null;
    return aircraft?.registration ?? "Aircraft";
  }, [aircraft?.registration, loading]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="mb-8">
        <Link
          href="/aircraft"
          className="inline-flex cursor-pointer items-center gap-2 text-sm text-white/45 hover:text-white/80"
        >
          ← Back to aircraft
        </Link>
        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-52" />
              <Skeleton className="h-4 w-80" />
            </div>
          ) : (
            <>
              <h1 className="font-mono text-3xl font-light tracking-tight text-white/90">
                {headline}
              </h1>
              <p className="mt-2 text-sm text-white/35">
                {(aircraft?.make || "—") +
                  (aircraft?.model ? ` · ${aircraft.model}` : "") +
                  (aircraft?.serial?.trim() ? ` · Serial ${aircraft.serial}` : "")}
              </p>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
            Aircraft
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] text-white/55">
            <div className="min-w-0">
              <p className="text-white/35">Registration</p>
              {loading ? (
                <Skeleton className="mt-2 h-4 w-28" />
              ) : (
                <p className="mt-1 truncate text-white/80">{aircraft?.registration ?? "—"}</p>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white/35">Serial</p>
              {loading ? (
                <Skeleton className="mt-2 h-4 w-28" />
              ) : (
                <p className="mt-1 truncate text-white/80">{aircraft?.serial?.trim() || "—"}</p>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white/35">Make</p>
              {loading ? (
                <Skeleton className="mt-2 h-4 w-28" />
              ) : (
                <p className="mt-1 truncate text-white/80">{aircraft?.make || "—"}</p>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white/35">Model</p>
              {loading ? (
                <Skeleton className="mt-2 h-4 w-28" />
              ) : (
                <p className="mt-1 truncate text-white/80">{aircraft?.model || "—"}</p>
              )}
            </div>
          </div>
        </div>

        <ApplicableAds aircraft={aircraft} loading={loading} />
      </div>
    </div>
  );
}

