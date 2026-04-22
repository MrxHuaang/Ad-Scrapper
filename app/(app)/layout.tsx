"use client";

import { type ReactNode } from "react";
import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { AppHeader } from "@/components/layout/AppHeader";
import { ToastContainer } from "@/components/ui/Toast";

function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-black">
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
