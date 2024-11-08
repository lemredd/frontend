import { addColorsToChartData, buildChartConfig } from '@/lib/utils'
import { PostgrestSingleResponse } from '@supabase/supabase-js' // Import the response type from Supabase
import { useEffect, useState } from 'react'

type ChartDataItem = Record<string, any>
type ChartTypes = 'bar' | 'area' | 'line'

interface FetchChartDataOptions {
  fetchData: () => Promise<PostgrestSingleResponse<ChartDataItem[]>>
  labelKey: string
  chartType?: ChartTypes
}

function transformAreaChartData(rawData: any[]) {
  const groupedData: {
    [month: string]: { month: string; provider: number; seeker: number }
  } = {}

  rawData.forEach((item) => {
    const month = new Date(item.month_created).toLocaleString('default', {
      month: 'long',
    })

    if (!groupedData[month]) {
      groupedData[month] = { month, provider: 0, seeker: 0 }
    }

    if (item.name === 'PROVIDER') {
      groupedData[month].provider += item.profile_roles_count
    } else if (item.name === 'SEEKER') {
      groupedData[month].seeker += item.profile_roles_count
    }
  })

  return Object.values(groupedData)
}

export function useFetchChartData({
  fetchData,
  labelKey,
  chartType,
}: FetchChartDataOptions) {
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

      let data = response.data || []

      const config = buildChartConfig(data, labelKey)

      if (chartType === 'area') {
        data = transformAreaChartData(data)
      }

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
