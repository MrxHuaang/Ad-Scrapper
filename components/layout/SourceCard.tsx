"use client";

import type { ReactNode } from "react";
import type { SourceKey } from "@/types";

export interface SourceCardProps {
  sourceKey: SourceKey;
  label: string;
  flag?: string;
  icon?: ReactNode;
  count?: number;
  status?: "online" | "warning" | "unknown";
  isActive: boolean;
  isComingSoon?: boolean;
  onClick: () => void;
}

export function SourceCard({
  label,
  flag,
  icon,
  count,
  status,
  isActive,
  isComingSoon,
  onClick,
}: SourceCardProps) {
  return (
    <button
      type="button"
      onClick={isComingSoon ? undefined : onClick}
      className="flex w-full items-center gap-2 px-[10px] py-[6px] text-left transition-colors"
      style={{
        borderLeft: `2px solid ${isActive ? "var(--accent)" : "transparent"}`,
        backgroundColor: isActive ? "var(--surface-2)" : "transparent",
        opacity: isComingSoon ? 0.45 : 1,
        cursor: isComingSoon ? "default" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!isComingSoon && !isActive) {
          e.currentTarget.style.backgroundColor = "var(--surface-2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      <span className="text-sm leading-none">
        {flag ?? icon}
      </span>

      {status && (
        <span
          className="inline-block h-[6px] w-[6px] shrink-0 rounded-full"
          style={{
            backgroundColor:
              status === "online"
                ? "#22c55e"
                : status === "warning"
                  ? "#f59e0b"
                  : "var(--text-3)",
          }}
        />
      )}

      <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-1)]">
        {label}
      </span>

      {isComingSoon && (
        <span className="shrink-0 rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] text-[var(--text-3)]">
          Soon
        </span>
      )}

      {count !== undefined && count > 0 && !isComingSoon && (
        <span className="shrink-0 text-xs text-[var(--text-2)]">{count}</span>
      )}
    </button>
  );
}
