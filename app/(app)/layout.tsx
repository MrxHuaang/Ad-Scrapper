export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      {/* TODO: sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--bg)] lg:block">
        <div className="p-4 text-sm font-semibold tracking-tight">Zephr</div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* TODO: top header bar */}
        <header className="flex h-12 items-center border-b border-[var(--border)] px-4">
          <span className="text-xs text-[var(--text-3)]">Ready</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
