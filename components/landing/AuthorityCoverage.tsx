"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import * as THREE from "three";

/* ── Airplane model, driven by scroll ── */
function Airplane({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const { scene } = useGLTF("/boeing-767.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const t = scrollYProgress.get();

    // x: flies left → right across viewport (world units)
    ref.current.position.x = THREE.MathUtils.lerp(-6, 6, t);
    // y: gentle altitude arc (rises then dips)
    ref.current.position.y = Math.sin(t * Math.PI) * 1.2 - 0.3;
    // bank: tilts into the turn
    ref.current.rotation.z = THREE.MathUtils.lerp(0.18, -0.18, t);
    // yaw: nose tracks flight direction
    ref.current.rotation.y = THREE.MathUtils.lerp(-0.3, 0.3, t) + Math.PI;
    // subtle pitch
    ref.current.rotation.x = Math.sin(t * Math.PI) * 0.08;
  });

  return (
    <group ref={ref}>
      <primitive object={scene} scale={0.012} />
    </group>
  );
}

/* ── Stat items that fade in ── */
const STATS = [
  { value: "28,431", label: "Directives indexed" },
  { value: "4", label: "Global authorities" },
  { value: "24h", label: "Sync cadence" },
  { value: "100%", label: "Official sources" },
];

export function AuthorityCoverage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Camera z: subtle zoom as plane passes
  const cameraZ = useTransform(scrollYProgress, [0, 0.5, 1], [7, 6, 7]);

  return (
    <section
      id="regulators"
      ref={containerRef}
      className="relative overflow-hidden bg-black"
      style={{ height: "160vh" }}
    >
      {/* Sticky container — canvas + overlay stay fixed while section scrolls */}
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center">

        {/* Ambient glow underneath */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(232,184,75,0.05) 0%, transparent 65%)",
          }}
          aria-hidden
        />

        {/* Three.js canvas */}
        <div className="absolute inset-0 z-[1]">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
            <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#e8b84b" />
            <Suspense fallback={null}>
              <Airplane scrollYProgress={scrollYProgress} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* Top fade */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32"
          style={{ background: "linear-gradient(to bottom, #000 0%, transparent 100%)" }}
          aria-hidden
        />
        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32"
          style={{ background: "linear-gradient(to top, #000 0%, transparent 100%)" }}
          aria-hidden
        />

        {/* Foreground text */}
        <div className="relative z-30 w-full max-w-6xl px-6 lg:px-8">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#3f3f3f]"
          >
            Global Coverage
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mb-16 text-center font-[family-name:var(--font-cormorant)] text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-white"
          >
            Every directive.{" "}
            <span className="italic zl-text-spectrum">Every authority.</span>
          </motion.h2>

          {/* Stats row — bottom of viewport */}
          <div className="absolute inset-x-6 bottom-20 lg:inset-x-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="text-center"
                >
                  <p className="font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-none text-white">
                    {s.value}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#737373]">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

useGLTF.preload("/boeing-767.glb");
