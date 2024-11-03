import { AreaChartLegend } from '@/components/custom/charts/area-chart'
import { HorizontalBarChart } from '@/components/custom/charts/horizontal-bar'
import { LineChartLabel } from '@/components/custom/charts/line-chart'
import { PieChartGraph } from '@/components/custom/charts/pie-chart'

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 xl:grid-cols-3">
        <HorizontalBarChart />
        <PieChartGraph />
        <AreaChartLegend />
      </div>
      <LineChartLabel />
    </div>
  )
}
