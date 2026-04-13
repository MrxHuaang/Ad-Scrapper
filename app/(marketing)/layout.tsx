export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* TODO: marketing navbar */}
      <main className="flex flex-1 flex-col">{children}</main>
      {/* TODO: marketing footer */}
    </div>
  );
}
