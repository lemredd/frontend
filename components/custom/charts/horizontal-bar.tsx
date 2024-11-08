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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { addColorsToChartData, buildChartConfig } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function HorizontalBarChart() {
  const [chartData, setChartData] = useState<any>([])
  const [chartConfig, setChartConfig] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Simulating data fetching
  const fetchChartData = async () => {
    const data = await new Promise<any[]>((resolve) =>
      setTimeout(() => {
        resolve([
          {
            skill: 'Front-End Developer',
            jobs: 275,
          },
          {
            skill: 'Back-End Developer',
            jobs: 200,
          },
          { skill: 'Graphic Artist', jobs: 187 },
          { skill: 'Project Manager', jobs: 173 },
          { skill: 'UI/UX Designer', jobs: 90 },
          {
            skill: 'Database Administrator',
            jobs: 85,
          },
          { skill: 'DevOps Engineer', jobs: 80 },
          {
            skill: 'Product Owner',
            jobs: 75,
          },
          {
            skill: 'Mobile Developer',
            jobs: 70,
          },
          {
            skill: 'Technical Writer',
            jobs: 65,
          },
          {
            skill: 'Cybersecurity Analyst',
            jobs: 60,
          },
          { skill: 'QA Engineer', jobs: 55 },
          {
            skill: 'Business Analyst',
            jobs: 50,
          },
          {
            skill: 'Data Scientist',
            jobs: 45,
          },
          {
            skill: 'Machine Learning Engineer',
            jobs: 40,
          },
        ])
      }, 1000),
    )

    // Build chart config with the fetched data
    const config = buildChartConfig(data, 'skill', 'jobs')
    const dataWithColors = addColorsToChartData(data, config)

    // Update state
    setChartData(dataWithColors)
    setChartConfig(config)
    setLoading(false)
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchChartData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Skills by Job Demand</CardTitle>
          <CardDescription>All-time job demand</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    )
  }

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
