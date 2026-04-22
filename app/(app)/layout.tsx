"use client";

import { type ReactNode } from "react";
import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { ToastContainer } from "@/components/ui/Toast";

function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-theme min-h-dvh bg-[var(--bg)]">
      <main className="h-dvh">{children}</main>
      <ToastContainer />
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
