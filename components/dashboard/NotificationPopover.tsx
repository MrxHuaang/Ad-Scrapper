"use client";

import { Bell, AlertTriangle, RefreshCw, Bookmark, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const initialNotifications = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "#ef4444",
    title: "New FAA AD 2024-09-12",
    body: "Boeing 737 rudder control system — immediate action required",
    timestamp: "8 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: RefreshCw,
    iconColor: "#e8b84b",
    title: "EASA AD 2024-0218 amended",
    body: "Airbus A320 pressurization system — revised compliance date",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    icon: Bookmark,
    iconColor: "#3B82F6",
    title: "Watchlist match",
    body: "Transport Canada issued AD affecting your monitored fleet type",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    icon: Zap,
    iconColor: "#00d47f",
    title: "Database synchronized",
    body: "21,450 ADs indexed — ANAC Brasil updated with 12 new directives",
    timestamp: "2 days ago",
    unread: false,
  },
];

function Dot() {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-[#e8b84b]"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export function NotificationPopover() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleClick = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-white/35 transition-colors hover:bg-white/[0.05] hover:text-white/70"
          aria-label="Open notifications"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1.5 -top-1.5 min-w-[18px] px-1 py-0 text-[10px] leading-[18px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-80 p-1">
        {/* Header */}
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <span className="text-sm font-semibold text-[var(--text-1)]">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Divider */}
        <div
          role="separator"
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-white/[0.06]"
        />

        {/* Notification list */}
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.04]"
            >
              <div className="relative flex items-start gap-3 pe-3">
                {/* Icon */}
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]"
                  style={{ color: n.iconColor }}
                >
                  <Icon size={14} />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-0.5">
                  <button
                    className="w-full text-left after:absolute after:inset-0"
                    onClick={() => handleClick(n.id)}
                  >
                    <span className="text-[13px] font-medium text-[var(--text-1)]">
                      {n.title}
                    </span>
                  </button>
                  <p className="text-[12px] leading-relaxed text-[var(--text-3)]">
                    {n.body}
                  </p>
                  <p className="text-[11px] text-white/25">{n.timestamp}</p>
                </div>

                {/* Unread dot */}
                {n.unread && (
                  <div className="absolute end-0 top-1/2 -translate-y-1/2">
                    <Dot />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
