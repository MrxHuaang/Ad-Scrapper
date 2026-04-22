"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LogOut, Sparkles, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export function ProfileMenu({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, plan } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const handleSignOut = useCallback(async () => {
    await createClient().auth.signOut();
    window.location.href = "/login";
  }, []);

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <div ref={ref} className="relative mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 transition-all hover:bg-white/[0.05] ${
          open ? "bg-white/[0.05]" : ""
        }`}
      >
        <div 
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg font-semibold text-white/70"
          style={{ background: "#1e1e1e", border: "1px solid #2e2e2e" }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex flex-1 flex-col items-start overflow-hidden">
            <span className="w-full truncate text-[13px] font-medium text-white">{displayName}</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">{plan} plan</span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`absolute z-50 overflow-hidden rounded-xl p-1 shadow-2xl ${
              isCollapsed ? "left-full bottom-0 ml-2 w-48" : "bottom-full left-0 mb-2 w-full"
            }`}
            style={{ background: "#111", border: "1px solid #222" }}
          >
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
            >
              <User size={13} /> Account
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
            >
              <LogOut size={13} /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
