import { addColorsToChartData, buildChartConfig } from '@/lib/utils'
import { PostgrestSingleResponse } from '@supabase/supabase-js' // Import the response type from Supabase
import { useEffect, useState } from 'react'

type ChartDataItem = Record<string, any>

interface FetchChartDataOptions {
  fetchData: () => Promise<PostgrestSingleResponse<ChartDataItem[]>>
  xKey: string // x-axis data key
}

export function useFetchChartData({ fetchData, xKey }: FetchChartDataOptions) {
  const [chartData, setChartData] = useState<any>([])
  const [chartConfig, setChartConfig] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const fetchChartData = async () => {
    try {
      const response = await fetchData()

      if (response.error) {
        console.error('Error fetching chart data:', response.error)
        return
      }

      const data = response.data || []

      const config = buildChartConfig(data, xKey)
      const dataWithColors = addColorsToChartData(data, config)

      setChartData(dataWithColors)
      setChartConfig(config)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChartData()
  }, [fetchData])

  return { chartData, chartConfig, loading }
}
