export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-lg border border-dashed bg-muted/40"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-lg border border-dashed bg-muted/40" />
    </div>
  )
}
