import { type ReactNode } from "react";
import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { ToastContainer } from "@/components/ui/Toast";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="app-theme h-dvh bg-[var(--bg)] overflow-hidden">
        {children}
        <ToastContainer />
      </div>
    </SidebarProvider>
  );
}
