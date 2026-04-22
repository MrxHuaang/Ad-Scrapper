"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";

const Spline = dynamic(() => import("spline-alias"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-ping rounded-full border border-[var(--zl-gold)] opacity-20" />
        <div className="absolute inset-4 animate-pulse rounded-full bg-[var(--zl-gold)] opacity-10" />
      </div>
    </div>
  ),
});

const SCENE_URL =
  "https://prod.spline.design/Fb69OpwlrEsKUrSH/scene.splinecode";

type RotationTarget = {
  rotation?: {
    x: number;
    y: number;
  };
};

export function SplineCube() {
  const [loaded, setLoaded] = useState(false);
  const appRef = useRef<Application | null>(null);
  const targetRef = useRef<RotationTarget | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const candidateNames = useMemo(
    () => ["Camera", "Main Camera", "camera", "Sphere", "Blob", "Ball", "Group"],
    [],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current = { x, y };

      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const target = targetRef.current;
        if (!target) return;
        const tiltY = mouseRef.current.x * 0.22;
        const tiltX = -mouseRef.current.y * 0.12;
        if (target.rotation) {
          target.rotation.y = tiltY;
          target.rotation.x = tiltX;
        }
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute top-1/2 z-0 hidden -translate-y-1/2 md:block md:right-[2%] md:h-[min(74vw,92vh)] md:w-[min(74vw,92vh)] lg:right-[6%] lg:h-[min(66vw,92vh)] lg:w-[min(66vw,92vh)]"
      style={{
        opacity: loaded ? undefined : 0,
        transition: "opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="h-full w-full [transform:translateZ(0)] mix-blend-screen brightness-110 contrast-110 saturate-125 md:opacity-75 lg:opacity-85 [&_canvas]:!h-full [&_canvas]:!w-full">
        <Spline
          scene={SCENE_URL}
          onLoad={(app: Application) => {
            appRef.current = app;
            setLoaded(true);
            for (const name of candidateNames) {
              const obj = app.findObjectByName?.(name);
              if (obj) {
                targetRef.current = obj;
                break;
              }
            }
          }}
        />
      </div>
    </div>
  );
}
