import { AreaChartLegend } from '@/components/custom/charts/area-chart'
import { HorizontalBarChart } from '@/components/custom/charts/horizontal-bar'
import { LineChartLabel } from '@/components/custom/charts/line-chart'
import { PieChartGraph } from '@/components/custom/charts/pie-chart'

export default function Dashboard() {
  return (
    <div className="grid gap-4 p-4 pt-0 sm:grid-cols-1 md:grid-cols-4 xl:grid-cols-6">
      {/* Left Column (Horizontal Bar Chart) */}
      <div className="col-span-1 xl:col-span-2">
        <HorizontalBarChart />
      </div>

      {/* Top Row (Pie Charts) */}
      <div className="col-span-2 xl:col-span-4 grid grid-cols-2 gap-4">
        <PieChartGraph />
        <PieChartGraph />
      </div>

      {/* Bottom Row (Area Chart and Line Chart) */}
      <div className="xl:col-span-4 xl:col-start-3 grid gap-4">
        <AreaChartLegend />
        <LineChartLabel />
      </div>
    </div>
  )
}
