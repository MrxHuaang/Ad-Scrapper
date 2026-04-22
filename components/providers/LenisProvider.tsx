"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    // Lenis only on landing/marketing. Never enable for the dashboard/app area.
    const isMarketing =
      pathname === "/" ||
      pathname?.startsWith("/pricing") ||
      pathname?.startsWith("/terms") ||
      pathname?.startsWith("/privacy");
    if (!isMarketing) return;

    const lenis = new Lenis({ lerp: 0.08 });
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [pathname]);
  return <>{children}</>;
}
