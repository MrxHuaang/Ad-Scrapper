"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, Bookmark, Database } from "lucide-react";

const STATS = [
  { label: "Total Directives", value: "21,450", icon: Database, change: "+12 today" },
  { label: "Critical Alerts",  value: "84",     icon: AlertCircle, change: "Requires action", color: "#ef4444" },
  { label: "Saved for Fleet", value: "128",    icon: Bookmark, change: "Across 4 models" },
  { label: "Index Quality",   value: "99.8%",  icon: TrendingUp, change: "Uptime 100%" },
];

export function StatCards() {
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
            <span style={stat.color ? { color: stat.color, opacity: 0.8 } : {}}>
              {stat.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
