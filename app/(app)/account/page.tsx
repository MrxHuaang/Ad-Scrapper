"use client";

export const dynamic = "force-dynamic";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  LogOut,
  Pencil,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/hooks/useToast";

const PLAN_META = {
  free: {
    label: "Free",
    textColor: "text-white/50",
    badgeBg: "bg-white/[0.05]",
    badgeBorder: "border-white/10",
    dot: "bg-white/20",
    features: [
      "50 AD searches / month",
      "3 aviation authorities",
      "Basic result filtering",
    ],
  },
  pro: {
    label: "Pro",
    textColor: "text-[#e8b84b]",
    badgeBg: "bg-[#e8b84b]/[0.10]",
    badgeBorder: "border-[#e8b84b]/25",
    dot: "bg-[#e8b84b]",
    features: [
      "Unlimited searches",
      "All 9 authorities",
      "Advanced filters",
      "CSV & Excel export",
      "Saved searches & watchlist",
    ],
  },
  team: {
    label: "Team",
    textColor: "text-purple-300",
    badgeBg: "bg-purple-500/[0.10]",
    badgeBorder: "border-purple-400/25",
    dot: "bg-purple-400",
    features: [
      "Everything in Pro",
      "Multi-user workspace",
      "Team watchlists",
      "Priority support",
      "API access",
    ],
  },
} as const;

function Avatar({
  avatarUrl,
  initials,
  size,
}: {
  avatarUrl?: string;
  initials: string;
  size: number;
}) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl font-semibold text-white/75"
      style={{
        width: size,
        height: size,
        background: "#1c1c1e",
        border: "1px solid rgba(255,255,255,0.09)",
        fontSize: size * 0.3,
      }}
    >
      {avatarUrl ? (
        <Image src={avatarUrl} alt="" fill unoptimized className="object-cover" />
      ) : (
        <span className="zl-text-spectrum select-none">{initials}</span>
      )}
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.38, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function AccountPage() {
  const { user, plan } = useAuth();
  const router = useRouter();

  const rawName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    "User";
  const email = user?.email ?? "";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const createdAt = user?.created_at ? new Date(user.created_at) : null;

  const initials = rawName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const [name, setName] = useState(rawName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openEdit = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 30);
  };

  const cancelEdit = () => {
    setName(rawName);
    setEditing(false);
  };

  const saveName = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === rawName) {
      cancelEdit();
      return;
    }
    setSaving(true);
    try {
      const { error } = await createClient().auth.updateUser({
        data: { full_name: trimmed },
      });
      if (error) throw error;
      showToast("Name updated", "success");
      setEditing(false);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not update name", "error");
    } finally {
      setSaving(false);
    }
  }, [name, rawName]);

  const signOut = useCallback(async () => {
    await createClient().auth.signOut();
    window.location.href = "/login";
  }, []);

  const meta = PLAN_META[plan];

  return (
    <div className="h-dvh overflow-y-auto scrollbar-custom">
      {/* Topbar */}
      <header
        className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b px-6"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "color-mix(in srgb, var(--bg) 88%, transparent)",
          backdropFilter: "blur(20px)",
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[13px] text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white/80"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="ml-1 flex items-center gap-2">
          <Zap size={14} className="text-[#e8b84b]" />
          <span className="font-serif text-base font-semibold text-white/60">Zephr</span>
        </div>
        <span className="ml-auto font-mono text-[11px] text-white/20">{email}</span>
      </header>

      <div className="mx-auto max-w-[640px] px-6 py-12">

        {/* Profile hero */}
        <motion.div {...fadeUp(0)} className="mb-10 flex items-center gap-5">
          <div className="relative">
            <Avatar avatarUrl={avatarUrl} initials={initials} size={68} />
            <span
              className={"absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 " + meta.dot}
              style={{ borderColor: "var(--bg)" }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold leading-tight text-white/90">{rawName}</h1>
            <p className="mt-0.5 truncate text-sm text-white/40">{email}</p>
            {createdAt && (
              <p className="mt-1 text-[11px] text-white/25">
                Member since {createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            )}
          </div>
          <span className={"shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest " + meta.textColor + " " + meta.badgeBg + " " + meta.badgeBorder}>
            {meta.label}
          </span>
        </motion.div>

        <div className="space-y-3">

          {/* Profile card */}
          <motion.section {...fadeUp(0.06)} className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">Profile</p>
            </div>

            {/* Name row */}
            <div className="flex items-center gap-4 border-b border-white/[0.06] px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Display name
                </p>
                {editing ? (
                  <input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveName();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    disabled={saving}
                    className="w-full rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-[#e8b84b]/40 focus:outline-none focus:ring-1 focus:ring-[#e8b84b]/20 disabled:opacity-50"
                  />
                ) : (
                  <p className="text-sm text-white/80">{rawName}</p>
                )}
              </div>
              {editing ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-white/35 transition-colors hover:bg-white/[0.04] hover:text-white/60"
                  >
                    <X size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={saveName}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8b84b]/30 bg-[#e8b84b]/10 px-3 py-1.5 text-[12px] font-semibold text-[#e8b84b] transition-colors hover:bg-[#e8b84b]/15 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : <><Check size={13} /> Save</>}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openEdit}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
                >
                  <Pencil size={12} />
                  Edit
                </button>
              )}
            </div>

            {/* Email row */}
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Email address
                </p>
                <p className="text-sm text-white/80">{email}</p>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2.5 py-0.5 text-[10px] font-medium text-emerald-400/70">
                verified
              </span>
            </div>
          </motion.section>

          {/* Plan card */}
          <motion.section {...fadeUp(0.11)} className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">Plan</p>
            </div>
            <div className="border-b border-white/[0.06] px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className={"text-lg font-bold " + meta.textColor}>{meta.label}</span>
                    <span className={"rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest " + meta.textColor + " " + meta.badgeBg + " " + meta.badgeBorder}>
                      Current
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {meta.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[12px] text-white/45">
                        <Check size={11} className={meta.textColor} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {plan === "free" && (
                  <button
                    type="button"
                    onClick={() => showToast("Upgrade flow coming soon", "info")}
                    className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#e8b84b]/30 bg-[#e8b84b]/10 px-4 py-2.5 text-sm font-semibold text-[#e8b84b] transition-all hover:bg-[#e8b84b]/16 hover:border-[#e8b84b]/45"
                  >
                    <Sparkles size={14} />
                    Upgrade
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast("Billing portal coming soon", "info")}
              className="flex w-full items-center justify-between px-5 py-4 text-[13px] text-white/40 transition-colors hover:bg-white/[0.02] hover:text-white/65"
            >
              <span>Billing &amp; invoices</span>
              <ChevronRight size={14} className="text-white/25" />
            </button>
          </motion.section>

          {/* Security card */}
          <motion.section {...fadeUp(0.16)} className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">Security</p>
            </div>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">Account ID</p>
              <p className="break-all font-mono text-[11px] text-white/35">{user?.id ?? "—"}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-2.5 px-5 py-4 text-[13px] text-red-400/65 transition-colors hover:bg-red-500/[0.04] hover:text-red-400"
            >
              <LogOut size={14} />
              Sign out of Zephr
            </button>
          </motion.section>

          {/* Danger zone */}
          <motion.section {...fadeUp(0.21)} className="overflow-hidden rounded-2xl border border-red-500/[0.12] bg-red-500/[0.02]">
            <div className="border-b border-red-500/[0.08] px-5 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-400/40">Danger zone</p>
            </div>
            <div className="flex items-center justify-between gap-6 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-white/55">Delete account</p>
                <p className="mt-0.5 text-[12px] text-white/30">
                  Permanently remove your account and all associated data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast("Contact support to delete your account", "info")}
                className="shrink-0 rounded-xl border border-red-500/20 px-3.5 py-2 text-[12px] font-medium text-red-400/60 transition-colors hover:bg-red-500/[0.06] hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </motion.section>
        </div>

        <motion.p {...fadeUp(0.28)} className="mt-10 text-center text-[11px] text-white/15">
          Zephr &middot; Aviation AD Intelligence Platform
        </motion.p>
      </div>
    </div>
  );
}
