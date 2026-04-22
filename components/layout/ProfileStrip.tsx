"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MoreHorizontal, LogOut, User, Sparkles } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export function ProfileStrip() {
  const { user, plan } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }, []);

  const displayName =
    user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <div
      ref={ref}
      className="relative border-t border-[var(--border)] px-4 py-[10px]"
    >
      <div className="flex items-center gap-[10px]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-2)]">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={32}
              height={32}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-[var(--text-2)]">
              {initials}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] text-[var(--text-1)]">
            {displayName}
          </span>
          <span className="text-[11px] text-[var(--text-2)]">
            {plan === "pro" ? (
              <span className="inline-flex items-center gap-0.5 text-blue-400">
                <Sparkles size={10} /> Pro
              </span>
            ) : plan === "team" ? (
              <span className="text-green-400">Team</span>
            ) : (
              "Free"
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded p-1 text-[var(--text-2)] hover:text-[var(--text-1)]"
          aria-label="User menu"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {open && (
        <div className="absolute bottom-full left-2 right-2 mb-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
          >
            <User size={14} /> My account
          </button>
          {plan === "free" && (
            <a
              href="/pricing"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
            >
              <Sparkles size={14} /> Upgrade plan
            </a>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
