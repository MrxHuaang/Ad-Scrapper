"use client";

import { useState, type ReactNode } from "react";
import { Globe } from "lucide-react";
import { SidebarProvider, useSidebar } from "@/components/providers/SidebarProvider";
import { SourceCard } from "@/components/layout/SourceCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProfileStrip } from "@/components/layout/ProfileStrip";
import { MobileOverlay } from "@/components/layout/MobileOverlay";
import { ToastContainer } from "@/components/ui/Toast";
import type { SourceKey } from "@/types";

interface SourceCardConfig {
  key: SourceKey;
  label: string;
  flag?: string;
  comingSoon?: boolean;
}

const AMERICAS: SourceCardConfig[] = [
  { key: "federal_register", label: "Federal Register", flag: "🇺🇸" },
  { key: "transport_canada", label: "Transport Canada", flag: "🇨🇦" },
  { key: "aerocivil_colombia", label: "AEROCIVIL", flag: "🇨🇴", comingSoon: true },
  { key: "anac_brazil", label: "ANAC Brazil", flag: "🇧🇷" },
  { key: "anac_argentina", label: "ANAC Argentina", flag: "🇦🇷" },
  { key: "dgac_chile", label: "DGAC Chile", flag: "🇨🇱" },
];

const EUROPE: SourceCardConfig[] = [
  { key: "easa", label: "EASA" },
];

const PACIFIC: SourceCardConfig[] = [
  { key: "casa_australia", label: "CASA", flag: "🇦🇺", comingSoon: true },
  { key: "gcaa_uae", label: "GCAA", flag: "🇦🇪", comingSoon: true },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-[10px] pb-1 pt-3 text-[10px] font-medium uppercase tracking-wider text-[var(--text-3)]">
      {children}
    </p>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { selectedSource, setSelectedSource, sourceCounts, sourceStatuses } =
    useSidebar();

  function handleClick(key: SourceKey) {
    setSelectedSource(key);
    onNavigate?.();
  }

  function renderCards(sources: SourceCardConfig[]) {
    return sources.map((s) => (
      <SourceCard
        key={s.key}
        sourceKey={s.key}
        label={s.label}
        flag={s.flag}
        icon={!s.flag ? <Globe size={14} className="text-[var(--text-2)]" /> : undefined}
        count={sourceCounts[s.key]}
        status={sourceStatuses[s.key]}
        isActive={selectedSource === s.key}
        isComingSoon={s.comingSoon}
        onClick={() => handleClick(s.key)}
      />
    ));
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Logo */}
      <a
        href="/search"
        className="flex items-center gap-2 px-4 py-4"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M3 17L9 3l4 8 5-4 3 14H3z"
            fill="var(--accent)"
            opacity="0.85"
          />
          <path
            d="M3 17L9 3l4 8 5-4 3 14"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span className="text-base font-bold tracking-tight text-[var(--text-1)]">
          Zephr
        </span>
      </a>

      {/* Source Cards */}
      <nav className="flex-1">
        <SectionLabel>Americas</SectionLabel>
        {renderCards(AMERICAS)}

        <SectionLabel>Europe</SectionLabel>
        {renderCards(EUROPE)}

        <SectionLabel>Pacific / Middle East</SectionLabel>
        {renderCards(PACIFIC)}

        <div className="mx-[10px] my-2 border-t border-[var(--border)]" />

        <SourceCard
          sourceKey="all"
          label="All sources"
          icon={<Globe size={14} className="text-[var(--text-2)]" />}
          count={sourceCounts.all}
          status={sourceStatuses.all}
          isActive={selectedSource === "all"}
          onClick={() => handleClick("all")}
        />
      </nav>

      {/* Profile */}
      <ProfileStrip />
    </div>
  );
}

function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="hidden w-[280px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] md:sticky md:top-0 md:block md:h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <MobileOverlay
        visible={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <aside
        className="fixed inset-y-0 left-0 z-[60] w-[280px] border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-200 md:hidden"
        style={{
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        <AppHeader onMenuToggle={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
