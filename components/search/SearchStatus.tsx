"use client";

import type { SearchStatus as Status } from "@/types";
import { Loader2 } from "lucide-react";

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
      <div className="flex items-center gap-2 text-sm">
        {status === "searching" && (
          <Loader2 size={14} className="animate-spin text-[var(--text-2)]" aria-hidden />
        )}
        <span className="text-[var(--text-2)]">
          {status === "searching" && "Buscando…"}
          {status === "done" && `${count} resultados · ${(ms / 1000).toFixed(1)}s`}
          {status === "error" && (
            <span className="text-amber-400">Error — {count} resultados recuperados</span>
          )}
        </span>
      </div>
      {errors.length > 0 && (
        <ul className="space-y-1">
          {errors.map((err, i) => (
            <li key={i} className="text-sm text-amber-400">
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
