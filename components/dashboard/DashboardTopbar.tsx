"use client";

import { Menu } from "lucide-react";

export function DashboardTopbar({
  query,
  onQueryChange,
  onMobileMenuOpen,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onMobileMenuOpen?: () => void;
}) {
  return (
    <header
      className="sticky top-0 z-40 flex h-12 items-center gap-3 px-4 md:hidden"
      style={{
        background: "color-mix(in srgb, var(--bg) 90%, transparent)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <button
        type="button"
        onClick={onMobileMenuOpen}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/70"
        aria-label="Open navigation"
      >
        <Menu size={16} />
      </button>
      <span className="font-serif text-base font-semibold text-[#e8b84b]">Zephr</span>
    </header>
  );
}
