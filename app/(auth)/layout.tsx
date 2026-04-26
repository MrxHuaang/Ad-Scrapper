import Prism from "@/components/landing/Prism";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4"
      style={{
        backgroundColor: "#09090b",
        backgroundImage: [
          "radial-gradient(ellipse 100% 55% at 50% -10%, rgba(255, 255, 255, 0.05) 0%, transparent 52%)",
          "radial-gradient(ellipse 70% 45% at 0% 45%, rgba(200, 208, 220, 0.045) 0%, transparent 55%)",
          "radial-gradient(ellipse 70% 45% at 100% 55%, rgba(188, 198, 212, 0.04) 0%, transparent 55%)",
        ].join(", "),
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.22] mix-blend-soft-light">
        <Prism
          animationType="rotate"
          timeScale={0.1}
          height={3.5}
          baseWidth={5.5}
          scale={3.55}
          hueShift={-0.02}
          colorFrequency={0.5}
          noise={0.1}
          glow={0.78}
          colorSaturation={0.1}
          transparent={true}
        />
      </div>
      <div className="relative z-10 w-full py-16">{children}</div>
    </div>
  );
}
