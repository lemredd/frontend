'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts'

import { countUsersByMonthCreated } from '@/actions/user'
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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchChartData } from '@/hooks/admin/useFetchChartData'
import { calculateTrend } from '@/lib/utils'

export function LineChartLabel() {
  const { chartData, chartConfig, loading } = useFetchChartData({
    fetchData: countUsersByMonthCreated,
    labelKey: 'name',
    chartType: 'line',
  })

  const currentMonthData = chartData[chartData.length - 1]?.count
  const previousMonthData = chartData[chartData.length - 2]?.count

  const { trendText, isTrendingUp } = calculateTrend(
    currentMonthData,
    previousMonthData,
  )

  const trendIcon = isTrendingUp ? (
    <TrendingUp className="h-4 w-4 text-green-500" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-500" />
  )

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
        <CardTitle>User Registration Trend</CardTitle>
        <CardDescription>
          {chartData.length > 1 &&
            `${chartData[0].month} - ${
              chartData[chartData.length - 1].month
            } 2024`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
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
            <Line
              dataKey="count"
              type="natural"
              stroke="var(--color-user_count)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-user_count)',
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {trendText} {trendIcon}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total number of users registered per month
        </div>
      </CardFooter>
    </Card>
  )
}
