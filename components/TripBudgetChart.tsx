"use client"

import {
  ChartContainer,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Pie, PieChart, Cell } from "recharts"

type BudgetSlice = {
  key: "fuel" | "toll" | "food" | "accommodation"
  name: string
  value: number
}

type TripBudgetChartProps = {
  data: BudgetSlice[]
}

const budgetChartConfig: ChartConfig = {
  fuel: {
    label: "ค่าน้ำมัน",
    color: "hsl(24 95% 58%)",
  },
  toll: {
    label: "ค่าทางด่วน",
    color: "hsl(197 97% 46%)",
  },
  food: {
    label: "ค่าอาหาร",
    color: "hsl(142 76% 45%)",
  },
  accommodation: {
    label: "ค่าที่พัก",
    color: "hsl(262 83% 58%)",
  },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function TripBudgetChart({ data }: TripBudgetChartProps) {
  return (
    <ChartContainer config={budgetChartConfig} className="h-56 w-full">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={3}
        >
          {data.map((item) => (
            <Cell
              key={item.key}
              fill={`var(--color-${item.key})`}
              stroke="transparent"
            />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="name"
              formatter={(value) => (
                <span className="font-mono text-xs">
                  {formatCurrency(Number(value))}
                </span>
              )}
            />
          }
        />
      </PieChart>
    </ChartContainer>
  )
}

