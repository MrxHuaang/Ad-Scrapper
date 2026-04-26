"use client";

import { motion } from "framer-motion";

interface SectionTransitionProps {
  type?: "beam" | "glow" | "curve" | "fadeBlack" | "softBlend";
  className?: string;
}

export function SectionTransition({ type = "glow", className = "" }: SectionTransitionProps) {
  if (type === "beam") {
    return (
      <div className={`relative h-24 w-full overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-[#e8b84b]/40 to-transparent"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="h-full w-full max-w-2xl opacity-20"
            style={{
              background: "radial-gradient(ellipse at center, #e8b84b 0%, transparent 70%)",
              transform: "scaleY(0.1)"
            }}
          />
        </div>
      </div>
    );
  }

  /** Soft vertical blend into solid black (e.g. Coverage → FAQ) — avoids a hard horizontal seam */
  if (type === "fadeBlack") {
    return (
      <div
        className={`pointer-events-none relative w-full overflow-hidden ${className}`}
        style={{ height: "clamp(5.5rem, 14vw, 12rem)" }}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.85]"
          style={{
            background:
              "radial-gradient(ellipse 85% 140% at 50% -20%, rgba(232, 184, 75, 0.055) 0%, transparent 58%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom,",
              "rgba(0,0,0,0) 0%,",
              "rgba(0,0,0,0.12) 22%,",
              "rgba(0,0,0,0.45) 52%,",
              "rgba(0,0,0,0.82) 78%,",
              "#000000 100%)",
            ].join(" "),
          }}
        />
      </div>
    );
  }

  /**
   * Soft vertical blend between sections (replaces the old SVG “semicircle” curve).
   * `curve` is kept as an alias for the same treatment.
   */
  if (type === "curve" || type === "softBlend") {
    return (
      <div
        className={`pointer-events-none relative w-full overflow-hidden ${className}`}
        style={{ height: "clamp(2rem, 5vw, 3.75rem)" }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom,",
              "rgba(0,0,0,0) 0%,",
              "rgba(0,0,0,0.08) 45%,",
              "rgba(0,0,0,0.2) 100%)",
            ].join(" "),
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.65]"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 50% 110%, rgba(232, 184, 75, 0.045) 0%, transparent 58%)",
          }}
        />
      </div>
    );
  }

  // Default: Glow / Ellipse
  return (
    <div className={`relative h-64 w-full overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(232, 184, 75, 0.07) 0%, transparent 80%)"
        }}
      />
    </div>
  );
}
