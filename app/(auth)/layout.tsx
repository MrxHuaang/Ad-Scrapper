import Prism from "@/components/landing/Prism";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 bg-black overflow-hidden">
      {/* Volumetric smoky background to match reference UI */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <Prism 
          animationType="rotate"
          timeScale={0.1}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.1}
          glow={1}
          colorSaturation={0}
          transparent={true}
        />
      </div>
      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
