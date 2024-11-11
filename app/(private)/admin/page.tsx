import { AreaChartLegend } from '@/components/custom/charts/area-chart'
import { HorizontalBarChart } from '@/components/custom/charts/horizontal-bar'
import { LineChartLabel } from '@/components/custom/charts/line-chart'
import { PieChartGraph } from '@/components/custom/charts/pie-chart'

export default function Dashboard() {
  return (
    <div className="grid gap-4 p-4 pt-0 sm:grid-cols-1 md:grid-cols-2">
      <HorizontalBarChart />

      <PieChartGraph />

      <AreaChartLegend />
      <LineChartLabel />
    </div>
  )
}
