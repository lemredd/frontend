'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { skill: 'Front-End Developer', jobs: 275, fill: 'var(--color-frontend)' },
  { skill: 'Back-End Developer', jobs: 200, fill: 'var(--color-backend)' },
  { skill: 'Graphic Artist', jobs: 187, fill: 'var(--color-graphic)' },
  { skill: 'Project Manager', jobs: 173, fill: 'var(--color-manager)' },
  { skill: 'UI/UX Designer', jobs: 90, fill: 'var(--color-uiux)' },
]

const chartConfig = {
  jobs: {
    label: 'Job Openings',
  },
  frontend: {
    label: 'Front-End Developer',
    color: 'hsl(var(--chart-1))',
  },
  backend: {
    label: 'Back-End Developer',
    color: 'hsl(var(--chart-2))',
  },
  graphic: {
    label: 'Graphic Artist',
    color: 'hsl(var(--chart-3))',
  },
  manager: {
    label: 'Project Manager',
    color: 'hsl(var(--chart-4))',
  },
  uiux: {
    label: 'UI/UX Designer',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export function HorizontalBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Skills by Job Demand</CardTitle>
        <CardDescription>All-time job demand</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="skill"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <XAxis
              dataKey="jobs"
              type="number"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="jobs"
              layout="vertical"
              radius={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Consistently high demand <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Reflects demand across all tracked periods
        </div>
      </CardFooter>
    </Card>
  )
}
