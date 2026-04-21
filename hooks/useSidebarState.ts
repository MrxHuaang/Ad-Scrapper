"use client";

import { useCallback, useState } from "react";
import type { SourceKey } from "@/types";

export function useSidebarState() {
  const [selectedSource, setSelectedSource] =
    useState<SourceKey>("federal_register");
  const [sourceCounts, setSourceCounts] = useState<
    Partial<Record<SourceKey, number>>
  >({});
  const [sourceStatuses, setSourceStatuses] = useState<
    Partial<Record<SourceKey, "online" | "warning" | "unknown">>
  >({});

  const updateCount = useCallback((key: SourceKey, count: number) => {
    setSourceCounts((prev) => ({ ...prev, [key]: count }));
  }, []);

  const updateStatus = useCallback(
    (key: SourceKey, status: "online" | "warning" | "unknown") => {
      setSourceStatuses((prev) => ({ ...prev, [key]: status }));
    },
    [],
  );

  return {
    selectedSource,
    setSelectedSource,
    sourceCounts,
    sourceStatuses,
    updateCount,
    updateStatus,
  };
}
