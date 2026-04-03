export default function AdminVoituresLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-[var(--color-bg-alt)]" />
          <div className="h-4 w-40 animate-pulse rounded bg-[var(--color-bg-alt)]" />
        </div>
        <div className="h-10 w-44 animate-pulse rounded-lg bg-[var(--color-bg-alt)]" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
        <div className="grid grid-cols-7 gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] px-3 py-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-[var(--color-border)]" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, r) => (
          <div key={r} className="grid grid-cols-7 items-center gap-2 border-b border-[var(--color-border)] px-3 py-3 last:border-0">
            <div className="h-[60px] w-[60px] animate-pulse rounded-lg bg-[var(--color-bg-alt)]" />
            <div className="col-span-2 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-bg-alt)]" />
              <div className="h-3 w-12 animate-pulse rounded bg-[var(--color-bg-alt)]" />
            </div>
            <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-bg-alt)]" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--color-bg-alt)]" />
            <div className="h-4 w-8 animate-pulse rounded bg-[var(--color-bg-alt)]" />
            <div className="flex justify-end gap-2">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--color-bg-alt)]" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--color-bg-alt)]" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--color-bg-alt)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
