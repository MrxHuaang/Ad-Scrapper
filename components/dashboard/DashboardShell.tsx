"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { ADResult } from "@/types";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { RightRail } from "@/components/dashboard/RightRail";
import { SettingsModal } from "@/components/dashboard/SettingsModal";

export function DashboardShell({
  activeTab,
  onTabChange,
  query,
  onQueryChange,
  results,
  configuredAuthorities,
  children,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  query: string;
  onQueryChange: (v: string) => void;
  results: ADResult[];
  configuredAuthorities: string[];
  children: ReactNode;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    "general" | "account" | "usage" | "billing"
  >("general");

  return (
    <div className="flex h-dvh bg-[var(--bg)]">
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenSettings={() => {
          setSettingsTab("general");
          setSettingsOpen(true);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          query={query}
          onQueryChange={onQueryChange}
        />

        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto scrollbar-custom">
            {children}
          </main>
          {activeTab === "dashboard" && (
            <RightRail
              results={results}
              configuredAuthorities={configuredAuthorities}
            />
          )}
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        initialTab={settingsTab}
      />
    </div>
  );
}

