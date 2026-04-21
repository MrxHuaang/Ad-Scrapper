"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("spline-alias"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-black" />,
});

const SCENE_URL =
  "https://prod.spline.design/GCC5liA6Pj2p7wnQ/scene.splinecode";

export function SplineCube() {
  return (
    <div className="pointer-events-none absolute top-1/2 z-0 hidden max-h-[800px] max-w-[800px] -translate-y-1/2 md:block md:-right-[20%] md:h-[min(60vw,85vh)] md:w-[min(60vw,85vh)] md:opacity-40 lg:-right-[10%] lg:h-[min(55vw,85vh)] lg:w-[min(55vw,85vh)] lg:opacity-50">
      <div className="h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full [&_canvas]:!object-contain">
        <Spline scene={SCENE_URL} />
      </div>
    </div>
  );
}
