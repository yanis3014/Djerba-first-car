export default function AdminStatsLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[var(--color-bg-alt)]" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-[var(--color-bg-alt)]" />
        <div className="h-4 w-56 animate-pulse rounded bg-[var(--color-bg-alt)]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[420px] animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]" />
        <div className="h-[420px] animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[380px] animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]" />
        <div className="h-[380px] animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]" />
      </div>

      <div className="h-[480px] animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]" />
      <div className="h-32 animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]" />
    </div>
  );
}
