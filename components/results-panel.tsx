"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"
import {
  Clock,
  RefreshCw,
  TrendingUp,
  Fuel,
  Utensils,
  Bed,
  Banknote,
} from "lucide-react"

type ResultData = {
  totalCost: number
  travelTime: string
  transport: number
  accommodation: number
  food: number
  misc: number
} | null

type ResultsPanelProps = {
  data: ResultData
  loading: boolean
  onRecalculate: () => void
}

const chartConfig: ChartConfig = {
  transport: { label: "Transport", color: "hsl(var(--chart-1))" },
  accommodation: { label: "Accommodation", color: "hsl(var(--chart-2))" },
  food: { label: "Food", color: "hsl(var(--chart-3))" },
  misc: { label: "Misc", color: "hsl(var(--chart-4))" },
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
]

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </div>
  )
}

export function ResultsPanel({ data, loading, onRecalculate }: ResultsPanelProps) {
  if (!data && !loading) {
    return (
      <Card className="flex h-full flex-col items-center justify-center border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <TrendingUp className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-foreground">No results yet</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Configure your trip on the left and click &quot;Start Optimization&quot; to see cost estimates.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="flex h-full flex-col items-center justify-center border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Calculating optimal budget...</p>
        </CardContent>
      </Card>
    )
  }

  const pieData = [
    { name: "transport", value: data!.transport },
    { name: "accommodation", value: data!.accommodation },
    { name: "food", value: data!.food },
    { name: "misc", value: data!.misc },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Total Cost Hero */}
      <Card className="border-primary/20 bg-primary/[0.03] shadow-sm">
        <CardContent className="flex flex-col items-center gap-1 py-6">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            Total Estimated Cost
          </span>
          <span className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {data!.totalCost.toLocaleString()}
            <span className="ml-1.5 text-lg font-medium text-muted-foreground">THB</span>
          </span>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Estimated travel time: {data!.travelTime}</span>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Fuel}
          label="Transport"
          value={`${data!.transport.toLocaleString()} THB`}
          color="bg-chart-1/10 text-chart-1"
        />
        <StatCard
          icon={Bed}
          label="Accommodation"
          value={`${data!.accommodation.toLocaleString()} THB`}
          color="bg-chart-2/10 text-chart-2"
        />
        <StatCard
          icon={Utensils}
          label="Food"
          value={`${data!.food.toLocaleString()} THB`}
          color="bg-chart-3/10 text-chart-3"
        />
        <StatCard
          icon={Banknote}
          label="Miscellaneous"
          value={`${data!.misc.toLocaleString()} THB`}
          color="bg-chart-4/10 text-chart-4"
        />
      </div>

      {/* Pie Chart */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[240px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                strokeWidth={0}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: COLORS[i] }}
                />
                <span className="text-xs capitalize text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recalculate */}
      <Button variant="outline" onClick={onRecalculate} className="w-full gap-2">
        <RefreshCw className="h-4 w-4" />
        Recalculate
      </Button>
    </div>
  )
}
