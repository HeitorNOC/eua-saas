import { MetricCard } from "@/components/cards/metric-card"

export function WorkerSummary({
  activeJobs,
  completedJobs,
}: {
  activeJobs: number
  completedJobs: number
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <MetricCard label="Jobs ativos" value={String(activeJobs)} />
      <MetricCard label="Jobs concluídos" value={String(completedJobs)} />
    </div>
  )
}
