"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useSidebarState } from "@/hooks/useSidebarState";
import type { SearchStatus, SourceKey } from "@/types";

interface SidebarContextValue {
  selectedSource: SourceKey;
  setSelectedSource: (key: SourceKey) => void;
  sourceCounts: Partial<Record<SourceKey, number>>;
  sourceStatuses: Partial<Record<SourceKey, "online" | "warning" | "unknown">>;
  updateCount: (key: SourceKey, count: number) => void;
  updateStatus: (
    key: SourceKey,
    status: "online" | "warning" | "unknown",
  ) => void;
  searchStatus: SearchStatus;
  setSearchStatus: (status: SearchStatus) => void;
  resultCount: number;
  setResultCount: (count: number) => void;
  elapsedMs: number;
  setElapsedMs: (ms: number) => void;
}

const SidebarCtx = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const sidebar = useSidebarState();
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [resultCount, setResultCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  return (
    <SidebarCtx
      value={{
        ...sidebar,
        searchStatus,
        setSearchStatus,
        resultCount,
        setResultCount,
        elapsedMs,
        setElapsedMs,
      }}
    >
      {children}
    </SidebarCtx>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarCtx);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
