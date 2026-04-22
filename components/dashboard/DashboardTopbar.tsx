"use client";

import { Bell, Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardTopbar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  return (
    <header
      className="sticky top-0 z-40 flex h-14 items-center gap-4 px-6"
      style={{
        background: "color-mix(in srgb, var(--bg) 86%, transparent)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="relative max-w-[720px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search AD by number, make, model, keyword…"
            className={cn(
              "w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-14 text-sm text-white placeholder:text-white/25",
              "focus:border-white/20 focus:bg-white/[0.05] focus:outline-none",
            )}
          />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-1 rounded-xl border border-white/10 bg-[var(--surface)]/60 px-2 py-1 text-[11px] text-white/35 sm:flex">
            <Command size={12} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/70"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}

