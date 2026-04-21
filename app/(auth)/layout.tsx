export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 bg-black">
      {/* Resend-style diagonal gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 100% 0%, rgba(255,255,255,0.06) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 0% 100%, rgba(255,255,255,0.04) 0%, transparent 50%)",
        }}
      />
      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
