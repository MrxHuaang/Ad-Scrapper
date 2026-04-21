"use client";

import { useToastListener } from "@/hooks/useToast";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const iconMap = {
  success: <CheckCircle size={14} className="text-emerald-400" aria-hidden />,
  error: <AlertCircle size={14} className="text-red-400" aria-hidden />,
  info: <Info size={14} className="text-blue-400" aria-hidden />,
};

const borderMap: Record<string, string> = {
  success: "border-emerald-500/20",
  error: "border-red-500/20",
  info: "border-blue-500/20",
};

export function ToastContainer() {
  const { toasts, dismiss } = useToastListener();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-1)] shadow-lg ${borderMap[t.type] ?? "border-[var(--border)]"}`}
          style={{
            animation: "toast-slide-in 0.25s ease-out",
          }}
        >
          {iconMap[t.type]}
          <span className="max-w-[280px] truncate">{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="ml-1 rounded p-0.5 text-[var(--text-3)] hover:text-[var(--text-1)]"
            aria-label="Close"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
