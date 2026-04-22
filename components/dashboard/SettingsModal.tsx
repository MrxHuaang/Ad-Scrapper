"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, User, Gauge, Settings2, CreditCard } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

type SettingsTab = "general" | "account" | "usage" | "billing";

function pct(n: number) {
  return Math.max(0, Math.min(100, n));
}

export function SettingsModal({
  open,
  onClose,
  initialTab,
}: {
  open: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
}) {
  const { user, plan } = useAuth();
  const [tab, setTab] = useState<SettingsTab>(() => initialTab ?? "general");
  const panelRef = useRef<HTMLDivElement | null>(null);

  const displayName =
    user?.user_metadata?.full_name ?? user?.email ?? "User";
  const email = user?.email ?? "—";

  const usage = useMemo(() => {
    // Real usage metrics should come from backend; for now keep it deterministic + presentable.
    // If you later add limits, this becomes a real meter.
    const usedPct = 68;
    return {
      usedPct,
      label: `${pct(usedPct)}% used`,
      renewal: "Renews on Nov 12, 2025",
    };
  }, []);

  const [pendingTheme, setPendingTheme] = useState<"dark" | "light">(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem("zephr-theme") as "dark" | "light" | null)
        : null;
    if (stored) return stored;
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("light") ? "light" : "dark";
    }
    return "dark";
  });
  const [dirtyTheme, setDirtyTheme] = useState(false);
  // NOTE: This component unmounts when `open` is false. We avoid setState-in-effect
  // by initializing per-open state via lazy initializers + user actions.
  // If you need to change the initial tab, pass `initialTab` before opening.

  const applyTheme = () => {
    const next = pendingTheme;
    if (next === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
    localStorage.setItem("zephr-theme", next);
    setDirtyTheme(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // Focus panel for accessibility.
    panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close settings"
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-[101] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface-2)] shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
      >
        <div className="flex h-[min(78vh,720px)]">
          {/* Left nav */}
          <aside className="w-[260px] shrink-0 border-r border-white/10 bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between px-2 py-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/85">Settings</p>
                <p className="truncate text-[11px] text-white/35">
                  {displayName}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/80"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 space-y-1">
              <NavItem
                active={tab === "general"}
                onClick={() => setTab("general")}
                icon={<Settings2 size={16} />}
                label="General"
              />
              <NavItem
                active={tab === "account"}
                onClick={() => setTab("account")}
                icon={<User size={16} />}
                label="Account"
              />
              <NavItem
                active={tab === "usage"}
                onClick={() => setTab("usage")}
                icon={<Gauge size={16} />}
                label="Usage"
              />
              <NavItem
                active={tab === "billing"}
                onClick={() => setTab("billing")}
                icon={<CreditCard size={16} />}
                label="Billing"
              />
            </div>

            <div className="mt-auto hidden" />
          </aside>

          {/* Content */}
          <section className="min-w-0 flex-1 overflow-y-auto p-6">
            {tab === "general" && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-white/90">General</h2>
                <p className="mt-1 text-sm text-white/35">
                  Preferences that apply across your workspace.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-sm font-semibold text-white/80">Theme</p>
                      <p className="mt-1 text-sm text-white/35">
                        Choose a theme and apply when ready.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-white/35">Dark</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={pendingTheme === "light"}
                        onClick={() => {
                          const next = pendingTheme === "dark" ? "light" : "dark";
                          setPendingTheme(next);
                          setDirtyTheme(true);
                        }}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
                          pendingTheme === "light"
                            ? "border-white/20 bg-white/20"
                            : "border-white/10 bg-white/10"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 rounded-full bg-white/80 transition-transform ${
                            pendingTheme === "light" ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-[12px] text-white/35">Light</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={!dirtyTheme}
                      onClick={() => {
                        const current = document.documentElement.classList.contains("light")
                          ? "light"
                          : "dark";
                        setPendingTheme(current);
                        setDirtyTheme(false);
                      }}
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-[12px] font-medium text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/75 disabled:opacity-40"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      disabled={!dirtyTheme}
                      onClick={applyTheme}
                      className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[12px] font-semibold text-white/70 transition-colors hover:bg-white/[0.09] hover:text-white disabled:opacity-40"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "account" && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-white/90">Account</h2>
                <p className="mt-1 text-sm text-white/35">
                  Profile and sign-in details.
                </p>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-sm font-semibold text-white/80">
                      Full name
                    </p>
                    <p className="mt-1 text-sm text-white/40">{displayName}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-sm font-semibold text-white/80">Email</p>
                    <p className="mt-1 text-sm text-white/40">{email}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-sm font-semibold text-white/80">Plan</p>
                    <p className="mt-1 text-sm text-white/40">{plan} plan</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "usage" && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-white/90">Usage</h2>
                <p className="mt-1 text-sm text-white/35">
                  Track usage for your plan.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/80">
                      Plan usage
                    </p>
                    <p className="text-[12px] text-white/35">{usage.label}</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-white/20"
                      style={{ width: `${pct(usage.usedPct)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[12px] text-white/25">{usage.renewal}</p>
                </div>
              </div>
            )}

            {tab === "billing" && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-white/90">Billing</h2>
                <p className="mt-1 text-sm text-white/35">
                  Billing details will appear here when connected.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/35">
                  Coming soon.
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-2 text-[13px] transition-colors ${
        active
          ? "border border-white/10 bg-white/[0.06] text-white/85"
          : "text-white/45 hover:bg-white/[0.04] hover:text-white/75"
      }`}
    >
      <span className={active ? "text-white/75" : "text-white/35"}>{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

