"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAircraft } from "@/lib/aircraft/aircraftPersistence";
import { showToast } from "@/hooks/useToast";

const fieldCls =
  "w-full rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-sm text-white/85 placeholder:text-white/25 focus:border-white/20 focus:outline-none";

export function AircraftForm() {
  const router = useRouter();
  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => registration.trim().length >= 2, [registration]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
      <header className="mb-8">
        <Link
          href="/aircraft"
          className="inline-flex cursor-pointer items-center gap-2 text-sm text-white/45 hover:text-white/80"
        >
          ← Back to aircraft
        </Link>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-white">Add aircraft</h1>
        <p className="mt-2 text-sm text-white/35">
          Create an aircraft record to match applicable directives.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit) return;
            setSubmitting(true);
            try {
              const ac = await createAircraft({ registration, make, model, serial });
              showToast("Aircraft created", "success");
              router.push(`/aircraft/${ac.id}`);
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Could not create aircraft";
              showToast(msg, "error");
            } finally {
              setSubmitting(false);
            }
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
              Registration
            </label>
            <input
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              placeholder="e.g. N123AB"
              className={`${fieldCls} mt-2`}
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
              className={`${fieldCls} mt-2`}
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
              className={`${fieldCls} mt-2`}
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
              className={`${fieldCls} mt-2`}
            />
          </div>

          <div className="sm:col-span-2 mt-2 flex items-center justify-end gap-3">
            <Link
              href="/aircraft"
              className="inline-flex cursor-pointer items-center rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/[0.03] hover:text-white/80"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="inline-flex cursor-pointer items-center rounded-lg border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-40"
            >
              {submitting ? "Creating…" : "Create aircraft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

