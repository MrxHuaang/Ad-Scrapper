"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AircraftRow } from "@/lib/aircraft/aircraftPersistence";
import { getAircraft, listAircraft } from "@/lib/aircraft/aircraftPersistence";
import { showToast } from "@/hooks/useToast";
import { ApplicableAds } from "@/components/aircraft/ApplicableAds";
import { AddAircraftModal } from "@/components/aircraft/AddAircraftModal";
import { useRouter } from "next/navigation";

export function AircraftDashboardView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AircraftRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selected, setSelected] = useState<AircraftRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  async function refreshList() {
    const rows = await listAircraft();
    setItems(rows);
    setSelectedId((prev) => prev ?? rows[0]?.id ?? null);
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const rows = await listAircraft();
        if (cancelled) return;
        setItems(rows);
        setSelectedId(rows[0]?.id ?? null);
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

  useEffect(() => {
    let cancelled = false;
    if (!selectedId) {
      setSelected(null);
      return;
    }
    setDetailLoading(true);
    (async () => {
      try {
        const row = await getAircraft(selectedId);
        if (!cancelled) setSelected(row);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Could not load aircraft detail";
        showToast(msg, "error");
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  return (
    <div className="pb-24">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-white">Aircraft</h1>
          <p className="mt-2 text-sm text-white/35">
            Manage your fleet registry and see applicable directives.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.06]"
        >
          <Plus size={16} />
          Add aircraft
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-stretch">
        {/* Row 1 / mobile order 1 — height matches Aircraft card on desktop (same grid row) */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-[var(--surface)] lg:row-start-1 lg:col-start-1">
          <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
              Registry
            </div>
            {loading ? <Skeleton as="span" className="h-3 w-16" /> : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
            {loading ? (
              <div className="space-y-4 p-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-2 h-3 w-full" />
                    <Skeleton className="mt-1 h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03]">
                  <Plus size={16} className="text-white/30" />
                </div>
                <p className="text-sm font-medium text-white/60">No aircraft yet</p>
                <p className="text-xs text-white/30">Add an aircraft to track applicable ADs.</p>
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="mt-1 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/[0.04] transition-colors"
                >
                  <Plus size={12} /> Add aircraft
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {items.map((ac) => {
                  const active = ac.id === selectedId;
                  return (
                    <button
                      key={ac.id}
                      type="button"
                      onClick={() => setSelectedId(ac.id)}
                      className={[
                        "w-full cursor-pointer px-5 py-4 text-left transition-colors",
                        active ? "bg-white/[0.04]" : "hover:bg-white/[0.03]",
                      ].join(" ")}
                    >
                      <div className="font-mono text-sm text-white/85">{ac.registration}</div>
                      <div className="mt-1 truncate text-sm text-white/45">
                        {(ac.make || "—") + (ac.model ? ` · ${ac.model}` : "")}
                      </div>
                      <div className="mt-2 text-[11px] text-white/30">
                        Serial: {ac.serial?.trim() ? ac.serial : "—"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Row 1 col 2 / mobile order 2 */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-[var(--surface)] p-5 lg:row-start-1 lg:col-start-2">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
              Aircraft
            </div>
            {selected && !detailLoading && (
              <button
                type="button"
                onClick={() => {
                  const qs = new URLSearchParams({ tab: "search" });
                  if (selected.make) qs.set("make", selected.make);
                  if (selected.model) qs.set("model", selected.model);
                  router.push(`/search?${qs.toString()}`);
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e8b84b]/25 bg-[#e8b84b]/5 px-2.5 py-1 text-[11px] font-semibold text-[#e8b84b] hover:bg-[#e8b84b]/10 transition-colors"
              >
                <Search size={11} />
                Search ADs
              </button>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] text-white/55">
            {detailLoading ? (
              <>
                <div><Skeleton className="h-4 w-28" /></div>
                <div><Skeleton className="h-4 w-28" /></div>
                <div><Skeleton className="h-4 w-28" /></div>
                <div><Skeleton className="h-4 w-28" /></div>
              </>
            ) : selected ? (
              <>
                <div className="min-w-0">
                  <p className="text-white/35">Registration</p>
                  <p className="mt-1 truncate text-white/80">{selected.registration}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-white/35">Serial</p>
                  <p className="mt-1 truncate text-white/80">{selected.serial?.trim() || "—"}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-white/35">Make</p>
                  <p className="mt-1 truncate text-white/80">{selected.make || "—"}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-white/35">Model</p>
                  <p className="mt-1 truncate text-white/80">{selected.model || "—"}</p>
                </div>
              </>
            ) : (
              <div className="col-span-2 text-sm text-white/40">
                Select an aircraft to view details.
              </div>
            )}
          </div>
        </div>

        {/* Row 2 / mobile order 3 — full width on mobile, second row right column on lg */}
        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          <ApplicableAds aircraft={selected} loading={detailLoading || loading} />
        </div>
      </div>

      <AddAircraftModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={refreshList}
        currentCount={items.length}
      />
    </div>
  );
}

