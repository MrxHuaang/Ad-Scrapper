"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AircraftRow } from "@/lib/aircraft/aircraftPersistence";
import { createAircraft, getAircraft, listAircraft } from "@/lib/aircraft/aircraftPersistence";
import { showToast } from "@/hooks/useToast";
import { ApplicableAds } from "@/components/aircraft/ApplicableAds";

function fieldCls() {
  return "w-full rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-sm text-white/85 placeholder:text-white/25 focus:border-white/20 focus:outline-none";
}

export function AircraftDashboardView() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AircraftRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selected, setSelected] = useState<AircraftRow | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");

  async function refreshList(selectAfter?: string) {
    const rows = await listAircraft();
    setItems(rows);
    const nextId = selectAfter ?? rows[0]?.id ?? null;
    setSelectedId(nextId);
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

  const canCreate = useMemo(() => registration.trim().length >= 2, [registration]);

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
              Registry
            </div>
            {loading ? <Skeleton as="span" className="h-3 w-16" /> : null}
          </div>

          {loading ? (
            <div className="p-5 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-3 w-full" />
                  <Skeleton className="mt-1 h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/40">
              No aircraft yet. Click “Add aircraft” to create one.
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

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
              Aircraft
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

          <ApplicableAds aircraft={selected} loading={detailLoading || loading} />
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
          <button
            type="button"
            onClick={() => setCreateOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/60"
            aria-label="Close"
          />
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white/85">Add aircraft</p>
                <p className="mt-1 text-xs text-white/35">Registration is required.</p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-white/40 hover:bg-white/[0.05] hover:text-white/70"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!canCreate || submitting) return;
                setSubmitting(true);
                try {
                  const ac = await createAircraft({ registration, make, model, serial });
                  showToast("Aircraft created", "success");
                  setCreateOpen(false);
                  setRegistration("");
                  setMake("");
                  setModel("");
                  setSerial("");
                  await refreshList(ac.id);
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : "Could not create aircraft";
                  showToast(msg, "error");
                } finally {
                  setSubmitting(false);
                }
              }}
              className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
                  Registration
                </label>
                <input
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  placeholder="e.g. N123AB"
                  className={`${fieldCls()} mt-2`}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
                  Make
                </label>
                <input
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Boeing"
                  className={`${fieldCls()} mt-2`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
                  Model
                </label>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 737-800"
                  className={`${fieldCls()} mt-2`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
                  Serial (optional)
                </label>
                <input
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="e.g. 12345"
                  className={`${fieldCls()} mt-2`}
                />
              </div>
              <div className="sm:col-span-2 mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="inline-flex cursor-pointer items-center rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/[0.03] hover:text-white/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canCreate || submitting}
                  className="inline-flex cursor-pointer items-center rounded-lg border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-40"
                >
                  {submitting ? "Creating…" : "Create aircraft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

