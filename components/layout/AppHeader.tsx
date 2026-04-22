"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun, LogOut, Sparkles, User } from "lucide-react";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";

function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const stored = localStorage.getItem("zephr-theme") as "dark" | "light" | null;
    if (stored === "light") {
      document.documentElement.classList.add("light");
      setThemeState("light");
    }
  }, []);
  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (next === "light") document.documentElement.classList.add("light");
      else document.documentElement.classList.remove("light");
      localStorage.setItem("zephr-theme", next);
      return next;
    });
  }, []);
  return { theme, toggle };
}

function ProfileMenu() {
  const { user, plan } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const handleSignOut = useCallback(async () => {
    await createClient().auth.signOut();
    window.location.href = "/login";
  }, []);

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold text-white/70 transition-all hover:ring-2 hover:ring-white/20"
        style={{ background: "#1e1e1e", border: "1px solid #2e2e2e" }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl py-1 shadow-2xl"
          style={{ background: "#111", border: "1px solid #222" }}
        >
          <div className="px-3.5 pb-2.5 pt-2">
            <p className="truncate text-[13px] font-medium text-white">{displayName}</p>
            <p className="mt-0.5 text-[11px]">
              {plan === "pro" ? (
                <span className="flex items-center gap-1 text-blue-400">
                  <Sparkles size={10} /> Pro plan
                </span>
              ) : plan === "team" ? (
                <span className="text-green-400">Team plan</span>
              ) : (
                <span className="text-white/35">Free plan</span>
              )}
            </p>
          </div>

          <div className="mx-2 my-1 h-px" style={{ background: "#1e1e1e" }} />

          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
          >
            <User size={13} /> Account
          </button>
          {plan === "free" && (
            <a
              href="/pricing"
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
            >
              <Sparkles size={13} /> Upgrade to Pro
            </a>
          )}

          <div className="mx-2 my-1 h-px" style={{ background: "#1e1e1e" }} />

          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function AppHeader() {
  const { searchStatus, resultCount, elapsedMs } = useSidebar();
  const { theme, toggle } = useTheme();

  const dotColor =
    searchStatus === "searching" ? "#f59e0b"
      : searchStatus === "error" ? "#ef4444"
      : "#22c55e";

  const statusLabel =
    searchStatus === "searching" ? "Searching…"
      : searchStatus === "done" ? `${resultCount.toLocaleString()} ADs · ${(elapsedMs / 1000).toFixed(1)}s`
      : searchStatus === "error" ? "Error"
      : null;

  return (
    <header
      className="sticky top-0 z-40 flex h-12 items-center justify-between px-6"
      style={{
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <Link href="/search" className="flex items-center gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 17L9 3l4 8 5-4 3 14H3z" fill="var(--zl-gold)" opacity="0.9" />
          <path d="M3 17L9 3l4 8 5-4 3 14" stroke="var(--zl-gold)" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.45" />
        </svg>
        <span className="text-sm font-bold tracking-tight text-white">Zephr</span>
      </Link>

      {/* Status pill */}
      {statusLabel && (
        <div className="hidden items-center gap-1.5 sm:flex">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: dotColor,
              animation: searchStatus === "searching" ? "pulse 1.5s infinite" : "none",
            }}
          />
          <span className="text-[11px] tabular-nums text-white/35">{statusLabel}</span>
        </div>
      )}

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          className="cursor-pointer inline-flex items-center justify-center rounded-lg p-1.5 text-white/25 transition-colors hover:text-white/60"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        <ProfileMenu />
      </div>
    </header>
  );
}
