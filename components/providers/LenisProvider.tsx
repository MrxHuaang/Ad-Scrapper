"use client";
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

    let lenis: any;
    let rafId: number;

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.08 });
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, [pathname]);
  return <>{children}</>;
}
