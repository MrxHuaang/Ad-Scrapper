"use client";

import { type FormEvent, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plane, Lock } from "lucide-react";
import { createAircraft } from "@/lib/aircraft/aircraftPersistence";
import { useAuth } from "@/components/providers/AuthProvider";
import { showToast } from "@/hooks/useToast";
import { Select } from "@/components/ui/Select";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { getMakeSuggestions, getModelSuggestions } from "@/lib/aircraft/aircraftSuggestions";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  currentCount: number;
}

const PLAN_LIMITS = { free: 1, pro: 10, team: Infinity } as const;

const CATEGORIES = [
  "SEP (Single Engine Piston)",
  "MEP (Multi Engine Piston)",
  "Turboprop",
  "Jet",
  "Helicopter",
  "Glider",
  "Ultra-light",
];

const fieldCls =
  "w-full rounded-lg border border-white/8 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-white/20 focus:bg-white/[0.05] focus:outline-none transition-colors";

export function AddAircraftModal({ open, onClose, onCreated, currentCount }: Props) {
  const { plan } = useAuth();
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] ?? 1;
  const atLimit = currentCount >= limit;

  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const [makeOptions, setMakeOptions] = useState<string[]>([]);
  const [modelOptions, setModelOptions] = useState<string[]>([]);

  // Fetch makes on mount
  useEffect(() => {
    if (open) {
      getMakeSuggestions().then(setMakeOptions);
    }
  }, [open]);

  // Fetch models when make changes
  useEffect(() => {
    if (make) {
      getModelSuggestions(make).then(setModelOptions);
    } else {
      setModelOptions([]);
    }
  }, [make]);

  function reset() {
    setRegistration(""); setMake(""); setModel("");
    setSerial(""); setYear(""); setCategory("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!registration.trim() || !make.trim() || !model.trim()) {
      showToast("Registration, make and model are required", "error");
      return;
    }
    setSaving(true);
    try {
      await createAircraft({
        registration,
        make,
        model,
        serial: serial || undefined,
      });
      showToast("Aircraft added", "success");
      reset();
      onCreated();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add aircraft";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl border border-white/8 bg-[var(--surface)] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/6 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8b84b]/10 border border-[#e8b84b]/20">
                    <Plane size={15} className="text-[#e8b84b]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">Add aircraft</p>
                    <p className="text-xs text-white/35">
                      {currentCount}/{limit === Infinity ? "∞" : limit} aircraft on {plan} plan
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-white/35 hover:bg-white/[0.05] hover:text-white/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Plan gate */}
              {atLimit ? (
                <div className="px-6 py-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] border border-white/8">
                    <Lock size={20} className="text-white/30" />
                  </div>
                  <p className="text-sm font-medium text-white/80 mb-2">
                    {plan === "free"
                      ? "Free plan allows 1 aircraft"
                      : `${plan} plan allows up to ${limit} aircraft`}
                  </p>
                  <p className="text-xs text-white/40 mb-5">
                    Upgrade to add more aircraft to your fleet
                  </p>
                  <a
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#e8b84b] px-4 py-2 text-sm font-semibold text-black hover:bg-[#d4a040] transition-colors"
                  >
                    Upgrade plan
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                  {/* Registration + Year */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5">Registration *</label>
                      <input
                        value={registration}
                        onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                        placeholder="N12345"
                        maxLength={12}
                        className={fieldCls}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5">Year</label>
                      <input
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="1998"
                        maxLength={4}
                        type="number"
                        min={1900}
                        max={new Date().getFullYear() + 1}
                        className={fieldCls}
                      />
                    </div>
                  </div>

                  {/* Make + Model */}
                  <div className="grid grid-cols-2 gap-3">
                    <Autocomplete
                      label="Make *"
                      value={make}
                      onChange={setMake}
                      options={makeOptions}
                      placeholder="Cessna"
                      required
                    />
                    <Autocomplete
                      label="Model *"
                      value={model}
                      onChange={setModel}
                      options={modelOptions}
                      placeholder="172S"
                      required
                    />
                  </div>

                  {/* Serial + Category */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5">Serial number</label>
                      <input
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                        placeholder="17281234"
                        className={fieldCls}
                      />
                    </div>
                    <Select
                      label="Category"
                      value={category}
                      onChange={setCategory}
                      options={CATEGORIES}
                      placeholder="Select..."
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="cursor-pointer px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {saving && (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
                      )}
                      {saving ? "Adding…" : "Add aircraft"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
