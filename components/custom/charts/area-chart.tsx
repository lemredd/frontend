'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { countProfilesByRole } from '@/actions/user'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchChartData } from '@/hooks/admin/useFetchChartData'

export function AreaChartLegend() {
  const { chartData, chartConfig, loading } = useFetchChartData({
    fetchData: countProfilesByRole,
    labelKey: 'name',
    chartType: 'area',
  })

  const currentMonthData = chartData[chartData.length - 1]
  const previousMonthData = chartData[chartData.length - 2]

  const currentTotal =
    currentMonthData?.seeker + currentMonthData?.provider || 0
  const previousTotal =
    previousMonthData?.seeker + previousMonthData?.provider || 0
  const trendChange = previousTotal
    ? ((currentTotal - previousTotal) / previousTotal) * 100
    : 0
  const isTrendingUp = trendChange > 0

  const trendIcon = isTrendingUp ? (
    <TrendingUp className="h-4 w-4" />
  ) : (
    <TrendingDown className="h-4 w-4" />
  )
  const trendText = isTrendingUp
    ? `Trending up by ${trendChange.toFixed(1)}%`
    : `Trending down by ${Math.abs(Number(trendChange.toFixed(1)))}%`

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <Skeleton className="h-4 w-36 mb-1" />
          <Skeleton className="h-4 w-24" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Role Trends Over Time</CardTitle>
        <CardDescription>
          A monthly overview of provider and seeker profile roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="seeker"
              type="natural"
              fill="var(--color-seeker)"
              fillOpacity={0.4}
              stroke="var(--color-seeker)"
              stackId="a"
            />
            <Area
              dataKey="provider"
              type="natural"
              fill="var(--color-provider)"
              fillOpacity={0.4}
              stroke="var(--color-provider)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trendText} {trendIcon}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData.length > 1 &&
                `${chartData[0].month} - ${
                  chartData[chartData.length - 1].month
                } 2024`}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
