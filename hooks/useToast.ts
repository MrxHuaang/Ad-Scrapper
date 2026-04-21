"use client";

import { useCallback, useEffect, useState } from "react";

/* ───── Types ───── */
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

/* ───── Mini event bus (avoids Context re-renders) ───── */
type Listener = (t: Toast) => void;
const listeners = new Set<Listener>();

export function showToast(message: string, type: Toast["type"] = "info") {
  const toast: Toast = { id: crypto.randomUUID(), message, type };
  listeners.forEach((fn) => fn(toast));
}

/* ───── Hook consumed by <ToastContainer /> ───── */
const DISMISS_MS = 4_000;

export function useToastListener() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler: Listener = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, DISMISS_MS);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, dismiss };
}
