"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Database, RefreshCw, Globe2, Activity } from "lucide-react";
import type { ADResult } from "@/types";
import { SOURCE_SHORT, normalizeSource } from "@/components/search/searchUtils";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseDate(d: string | undefined): Date | null {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function StatCards({ results }: { results: ADResult[] }) {
  const kpis = useMemo(() => {
    const total = results.length;

    const byAuthority: Record<string, number> = {};
    let updatedToday = 0;
    const today = new Date();

    for (const r of results) {
      const key = normalizeSource(r.Source);
      const short = SOURCE_SHORT[key] ?? key;
      byAuthority[short] = (byAuthority[short] ?? 0) + 1;

      const dt = parseDate(r.Effective_Date);
      if (dt && isSameDay(dt, today)) updatedToday += 1;
    }

    const activeAuthorities = Object.keys(byAuthority).length;
    const configuredAuthorities = 9; // SOURCE_KEYS excluding "all"
    const coverage = configuredAuthorities
      ? (activeAuthorities / configuredAuthorities) * 100
      : 0;

    return {
      total,
      updatedToday,
      activeAuthorities,
      coverage,
    };
  }, [results]);

  const STATS = [
    {
      label: "ADs indexed",
      value: kpis.total.toLocaleString(),
      icon: Database,
      change: results.length ? "Current search dataset" : "Run a search to see KPIs",
    },
    {
      label: "Updated today",
      value: kpis.updatedToday.toLocaleString(),
      icon: RefreshCw,
      change: "Based on Effective_Date",
    },
    {
      label: "Authorities",
      value: kpis.activeAuthorities.toLocaleString(),
      icon: Globe2,
      change: "With data in the current set",
    },
    {
      label: "Global coverage",
      value: `${Math.round(kpis.coverage * 10) / 10}%`,
      icon: Activity,
      change: "Authorities with data / configured",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md"
        >
          {/* Subtle brand glow behind icon */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.03]"
            style={{ background: "var(--zl-gold)", filter: "blur(24px)" }}
          />

          <div className="flex items-center gap-3 text-white/40">
            <stat.icon size={16} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">{stat.label}</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="zl-text-spectrum text-3xl font-semibold tracking-tight">{stat.value}</span>
          </div>

          <div className="mt-2 text-[11px] font-medium text-white/20">
            <span>{stat.change}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
