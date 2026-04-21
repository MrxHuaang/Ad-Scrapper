"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, Moon, Sun, HelpCircle } from "lucide-react";
import { useSidebar } from "@/components/providers/SidebarProvider";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("zephr-theme") as
      | "dark"
      | "light"
      | null;
    if (stored === "light") {
      document.documentElement.classList.add("light");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState("light");
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (next === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
      localStorage.setItem("zephr-theme", next);
      return next;
    });
  }, []);

  return { theme, toggle };
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const { searchStatus, resultCount, elapsedMs } = useSidebar();
  const { theme, toggle } = useTheme();

  const dotColor =
    searchStatus === "searching"
      ? "#f59e0b"
      : searchStatus === "error"
        ? "#dc2626"
        : "#22c55e";

  const dotPulse = searchStatus === "searching" || searchStatus === "idle" || searchStatus === "done";

  const statusText =
    searchStatus === "idle"
      ? "Ready"
      : searchStatus === "searching"
        ? "Searching..."
        : searchStatus === "done"
          ? `${resultCount} ADs · ${(elapsedMs / 1000).toFixed(1)}s`
          : `Error — ${resultCount} results`;

  return (
    <header
      className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-[var(--border)] px-4"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <button
        type="button"
        onClick={onMenuToggle}
        className="inline-flex items-center justify-center rounded p-1.5 text-[var(--text-2)] hover:text-[var(--text-1)] md:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{
            backgroundColor: dotColor,
            animation: dotPulse ? "pulse 2s infinite" : "none",
          }}
        />
        <span className="text-xs text-[var(--text-2)]">{statusText}</span>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center justify-center rounded p-1.5 text-[var(--text-2)] hover:text-[var(--text-1)]"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded p-1.5 text-[var(--text-2)] hover:text-[var(--text-1)]"
        aria-label="Keyboard shortcuts"
      >
        <HelpCircle size={16} />
      </button>
    </header>
  );
}
