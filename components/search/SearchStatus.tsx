"use client";

import type { SearchStatus as Status } from "@/types";

interface SearchStatusProps {
  status: Status;
  count: number;
  ms: number;
  errors: string[];
}

export function SearchStatus({ status, count, ms, errors }: SearchStatusProps) {
  if (status === "idle") return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="inline-flex items-center gap-2.5">
        {status === "searching" && (
          <span
            className="flex h-5 items-center gap-2 rounded-full px-3 text-[11px] font-medium"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            Searching...
          </span>
        )}
        {status === "done" && (
          <span
            className="flex h-5 items-center gap-2 rounded-full px-3 text-[11px] font-medium"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {count.toLocaleString()} results · {(ms / 1000).toFixed(1)}s
          </span>
        )}
        {status === "error" && (
          <span
            className="flex h-5 items-center gap-2 rounded-full px-3 text-[11px] font-medium"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Error — {count} results retrieved
          </span>
        )}
      </div>

      {errors.length > 0 && (
        <ul className="space-y-1 pl-1">
          {errors.map((err, i) => (
            <li key={i} className="text-[11px]" style={{ color: "#fbbf24" }}>
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
