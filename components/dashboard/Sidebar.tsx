"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  LayoutDashboard, 
  Bookmark, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  Zap,
  Moon,
  Sun
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileMenu } from "./ProfileMenu";

function useTheme() {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const stored = localStorage.getItem("zephr-theme") as "dark" | "light" | null;
    if (stored === "light") {
      document.documentElement.classList.add("light");
      setThemeState("light");
    }
  }, []);
  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (next === "light") document.documentElement.classList.add("light");
      else document.documentElement.classList.remove("light");
      localStorage.setItem("zephr-theme", next);
      return next;
    });
  }, []);
  return { theme, toggle };
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MENU_ITEMS = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "search",    label: "Search ADs", icon: Search },
  { id: "saved",     label: "Saved Items", icon: Bookmark },
  { id: "analytics", label: "Analytics",  icon: BarChart3 },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col border-r border-white/5 bg-[#050505] p-4 h-full"
    >
      {/* Brand */}
      <div className="mb-10 mt-2 flex items-center px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
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
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`btn-glass w-full justify-start ${isActive ? "btn-glass-active" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon size={18} className={isActive ? "text-[#e8b84b]" : "text-white/40"} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="active-dot"
                  className="ml-auto h-1 w-1 rounded-full bg-[#e8b84b]" 
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto flex flex-col gap-1 border-t border-white/5 pt-4">
        <button
          onClick={toggle}
          className="btn-glass w-full justify-start text-white/40 hover:text-white"
          title={isCollapsed ? (theme === "dark" ? "Dark Mode" : "Light Mode") : ""}
        >
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          {!isCollapsed && <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>}
        </button>

        <button className="btn-glass w-full justify-start">
          <Settings size={18} className="text-white/40" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        <ProfileMenu isCollapsed={isCollapsed} />

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 flex h-8 w-8 items-center justify-center self-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-colors hover:text-white"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={16} />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}
