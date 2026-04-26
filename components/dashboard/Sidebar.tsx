"use client";

import { useMemo, useRef, useState } from "react";
import {
  Search,
  LayoutDashboard,
  Bookmark,
  BarChart3,
  Download,
  Eye,
  BellRing,
  Newspaper,
  Plane,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileMenu } from "./ProfileMenu";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { ZephrLogo } from "@/components/icons/ZephrLogo";
import { NotificationPopover } from "./NotificationPopover";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSettings?: () => void;
  onOpenBilling?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "search", label: "ADs", icon: Search },
  { id: "aircraft", label: "Aircraft", icon: Plane },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "watchlist", label: "Watchlist", icon: Eye },
  { id: "exports", label: "Exports", icon: Download },
] as const;

const TOOL_ITEMS = [
  { id: "alerts", label: "Alerts", icon: BellRing },
  { id: "bulletins", label: "Bulletins", icon: Newspaper },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

const HEADER_H = 44; // px — height of the always-visible header strip

function NavItems({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <>
      <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
        Navigation
      </p>
      <nav className="mt-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={[
                "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-100",
                isActive
                  ? "bg-white/[0.07] text-white/90"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/80",
              ].join(" ")}
            >
              <Icon size={16} className={isActive ? "text-[#e8b84b]" : "text-white/30"} />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-5">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
          Tools
        </p>
        <nav className="mt-2 flex flex-col gap-0.5">
          {TOOL_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={[
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-100",
                  isActive
                    ? "bg-white/[0.07] text-white/90"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80",
                ].join(" ")}
              >
                <Icon size={16} className={isActive ? "text-[#e8b84b]" : "text-white/30"} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export function Sidebar({ activeTab, onTabChange, onOpenSettings, onOpenBilling, mobileOpen = false, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { resultCount } = useSidebar();

  const authorities = useMemo(() => [
    { key: "FAA", label: "FAA", count: null as number | null },
    { key: "EASA", label: "EASA", count: null as number | null },
    { key: "TC", label: "Transport Canada", count: null as number | null },
    { key: "ANAC", label: "ANAC Brasil", count: null as number | null },
    { key: "ARG", label: "ANAC Argentina", count: null as number | null },
    { key: "DGAC", label: "DGAC Chile", count: null as number | null },
  ], []);

  function openPanel() {
    clearTimeout(hideTimer.current);
    setPanelOpen(true);
  }

  function scheduleClose() {
    hideTimer.current = setTimeout(() => setPanelOpen(false), 200);
  }

  function handleTabChange(tab: string) {
    onTabChange(tab);
    if (mobileOpen && onMobileClose) onMobileClose();
    setPanelOpen(false);
  }

  function expand() {
    setIsCollapsed(false);
    setPanelOpen(false);
  }

  function collapse() {
    setIsCollapsed(true);
    if (mobileOpen && onMobileClose) onMobileClose();
  }

  /* ── Shared styles ── */
  const sidebarStyle: React.CSSProperties = {
    background: "var(--surface)",
    borderRight: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <>
      {/* ════════════════════════════════════════════
          MOBILE backdrop
      ════════════════════════════════════════════ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* ════════════════════════════════════════════
          COLLAPSED (desktop only)
          Header strip always visible at top-left.
          Hover header OR panel → panel stays open.
          Panel renders below the header, never on top.
      ════════════════════════════════════════════ */}
      {isCollapsed && !mobileOpen && (
        <div className="hidden md:block">
          {/* Always-visible header strip */}
          <div
            className="fixed left-0 top-0 z-[60] flex w-[244px] items-center justify-between px-3"
            style={{ height: HEADER_H, ...sidebarStyle, borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={openPanel}
            onMouseLeave={scheduleClose}
          >
            {/* Logo + name */}
            <div className="flex items-center gap-2.5">
              <ZephrLogo className="shrink-0" width={22} height={22} />
              <span className="font-serif text-base font-semibold text-[#e8b84b]">Zephr</span>
            </div>

            {/* Expand button */}
            <button
              type="button"
              onClick={expand}
              title="Pin sidebar"
              className="h-7 w-7 flex items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              <PanelLeftOpen size={15} />
            </button>
          </div>

          {/* Panel content — slides in below the header */}
          <AnimatePresence>
            {panelOpen && (
              <motion.div
                key="hover-panel"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.14 }}
                className="fixed left-0 z-50 flex w-[244px] flex-col"
                style={{
                  top: HEADER_H,
                  bottom: 0,
                  ...sidebarStyle,
                  borderTop: "none",
                }}
                onMouseEnter={openPanel}
                onMouseLeave={scheduleClose}
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2">
                  {/* Notifications */}
                  <div className="mb-2">
                    <NotificationPopover asSidebarItem />
                  </div>

                  {/* Nav — no Authorities in hover panel */}
                  <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
                    <NavItems activeTab={activeTab} onTabChange={handleTabChange} />
                  </div>

                  {/* Profile */}
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <ProfileMenu 
                      isCollapsed={false} 
                      onOpenSettings={onOpenSettings} 
                      onOpenBilling={onOpenBilling}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ════════════════════════════════════════════
          EXPANDED sidebar (desktop + mobile overlay)
      ════════════════════════════════════════════ */}
      <AnimatePresence initial={false}>
        {(!isCollapsed || mobileOpen) && (
          <motion.div
            key="sidebar-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 244, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={[
              "h-full flex flex-col overflow-hidden shrink-0",
              mobileOpen ? "fixed inset-y-0 left-0 z-50" : "relative",
            ].join(" ")}
            style={sidebarStyle}
          >
            <div className="flex h-full w-[244px] flex-col px-3 py-3">
              {/* Header — same height as collapsed strip so layout is stable */}
              <div
                className="mb-2 flex shrink-0 items-center justify-between px-1"
                style={{ height: HEADER_H - 24 }} // minus vertical padding
              >
                <div className="flex items-center gap-2.5">
                  <ZephrLogo className="shrink-0" width={22} height={22} />
                  <span className="font-serif text-base font-semibold text-[#e8b84b]">Zephr</span>
                </div>

                <button
                  type="button"
                  onClick={collapse}
                  title="Collapse sidebar"
                  className="h-7 w-7 flex items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                >
                  <PanelLeftClose size={15} />
                </button>
              </div>

              {/* Notifications */}
              <div className="mb-3 shrink-0">
                <NotificationPopover asSidebarItem />
              </div>

              {/* Scrollable nav */}
              <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
                <NavItems activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Authorities — only in full sidebar */}
                <div className="mt-5">
                  <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/20">
                    Authorities
                  </p>
                  <div className="mt-2 rounded-md border border-white/5 bg-white/[0.015]">
                    {authorities.map((a) => (
                      <div
                        key={a.key}
                        className="flex items-center justify-between px-3 py-1.5 text-xs text-white/40 hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="truncate">{a.label}</span>
                        <span className="tabular-nums text-[10px] text-white/20">
                          {a.count != null ? a.count.toLocaleString() : "—"}
                        </span>
                      </div>
                    ))}
                    <div className="px-3 py-1.5 text-[10px] text-white/15 border-t border-white/5">
                      Results: {resultCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div className="mt-3 border-t border-white/5 pt-3">
                <ProfileMenu 
                  isCollapsed={false} 
                  onOpenSettings={onOpenSettings} 
                  onOpenBilling={onOpenBilling}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
