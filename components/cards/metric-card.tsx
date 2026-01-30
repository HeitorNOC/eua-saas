import { Card, CardContent } from "@/components/ui/card"

export function MetricCard({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper?: string
}) {
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="text-2xl font-semibold">{value}</div>
        {helper ? (
          <p className="text-muted-foreground text-xs">{helper}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
