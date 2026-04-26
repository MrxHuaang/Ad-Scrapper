import Prism from "@/components/landing/Prism";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="relative flex min-h-dvh items-center justify-center px-4 bg-black overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(232, 184, 75, 0.08) 0%, transparent 100%)"
      }}
    >
      {/* Volumetric smoky background (Optimized WebGL) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-screen">
        <Prism 
          animationType="rotate"
          timeScale={0.1}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={0.5}
          noise={0.1}
          glow={1}
          colorSaturation={0.4}
          transparent={true}
        />
      </div>
      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
