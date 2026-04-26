"use client";

import { useMemo, useState } from "react";
import {
  Search,
  LayoutDashboard,
  Bookmark,
  BarChart3,
  ChevronLeft,
  Zap,
  Download,
  Eye,
  BellRing,
  Newspaper,
  Plane,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileMenu } from "./ProfileMenu";
import { useSidebar } from "@/components/providers/SidebarProvider";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSettings?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "search", label: "ADs", icon: Search },
  { id: "aircraft", label: "Aircraft", icon: Plane },
  { id: "saved", label: "Saved searches", icon: Bookmark },
  { id: "watchlist", label: "Watchlist", icon: Eye },
  { id: "exports", label: "Exports", icon: Download },
] as const;

const TOOL_ITEMS = [
  { id: "alerts", label: "Alerts", icon: BellRing },
  { id: "bulletins", label: "Bulletins", icon: Newspaper },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function Sidebar({ activeTab, onTabChange, onOpenSettings, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { resultCount } = useSidebar();
  const openSettings = onOpenSettings ?? undefined;

  const authorities = useMemo(() => {
    return [
      { key: "FAA", label: "FAA", count: null as number | null },
      { key: "EASA", label: "EASA", count: null as number | null },
      { key: "TC", label: "Transport Canada", count: null as number | null },
      { key: "ANAC", label: "ANAC Brasil", count: null as number | null },
      { key: "ARG", label: "ANAC Argentina", count: null as number | null },
      { key: "DGAC", label: "DGAC Chile", count: null as number | null },
    ];
  }, []);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <motion.div
        animate={{ width: isCollapsed ? 76 : 244 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={[
          "relative flex h-full flex-col border-r border-white/5 bg-[var(--surface)] px-3 py-3",
          // Mobile: fixed overlay, hidden by default
          "fixed inset-y-0 left-0 z-50 md:relative md:z-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
      {/* Brand */}
      <div className="mb-5 mt-1 flex items-center px-1.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <Zap size={20} className="text-[#e8b84b]" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-serif text-2xl font-semibold zl-text-spectrum"
            >
              Zephr
            </motion.span>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/80"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronLeft size={16} />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
        <p className={isCollapsed ? "sr-only" : "px-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20"}>
          Navigation
        </p>
        <nav className="mt-2 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                }}
                className={[
                  "flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-[13px] transition-colors",
                  isActive
                    ? "bg-white/[0.06] text-white/85"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white/80",
                ].join(" ")}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={18} className={isActive ? "text-[#e8b84b]" : "text-white/35"} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Authorities */}
        {!isCollapsed && (
          <div className="mt-5">
            <p className="px-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20">
              Authorities
            </p>
            <div className="mt-2 rounded-2xl border border-white/5 bg-white/[0.02] p-2">
              {authorities.map((a) => (
                <div
                  key={a.key}
                  className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[12px] text-white/45 hover:bg-white/[0.03]"
                >
                  <span className="truncate">{a.label}</span>
                  <span className="tabular-nums text-white/25">
                    {a.count != null ? a.count.toLocaleString() : "—"}
                  </span>
                </div>
              ))}
              <div className="mt-1 px-2.5 pb-1 text-[11px] text-white/20">
                Current results: {resultCount.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Tools */}
        {!isCollapsed && (
          <div className="mt-5">
            <p className="px-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20">
              Tools
            </p>
          </div>
        )}
        <nav className={isCollapsed ? "mt-5 flex flex-col gap-1.5" : "mt-2 flex flex-col gap-1.5"}>
          {TOOL_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={[
                  "flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-[13px] transition-colors",
                  isActive
                    ? "bg-white/[0.06] text-white/85"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white/80",
                ].join(" ")}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={18} className={isActive ? "text-[#e8b84b]" : "text-white/35"} />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex flex-col gap-1 border-t border-white/5 pt-3">
        <ProfileMenu
          isCollapsed={isCollapsed}
          onOpenSettings={openSettings}
        />
      </div>
    </motion.div>
    </>
  );
}
