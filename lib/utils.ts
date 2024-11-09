import { ChartConfig } from '@/components/ui/chart'
import { MAX_COLOR_VARIABLES } from '@/lib/constants'
import { DataItem } from '@/lib/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pluralize(count: number, word: string) {
  return count === 1 ? word : `${word}s`
}

export const formatErrorMessage = (errorCode: string) => {
  return errorCode
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const getInitialLetter = (text: string) => {
  return text.charAt(0)
}

export const getRecency = (date: string) => {
  const dateObj = new Date(date)
  const now = new Date()

  const DAY = 1000 * 60 * 60 * 24
  const diffDays = now.getTime() / DAY - dateObj.getTime() / DAY
  const days = Math.floor(diffDays)
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`

  const HOUR = 1000 * 60 * 60
  const diffHours = now.getTime() / HOUR - dateObj.getTime() / HOUR
  const hours = Math.floor(diffHours)
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`

  const MINUTE = 1000 * 60
  const diffMinutes = now.getTime() / MINUTE - dateObj.getTime() / MINUTE
  const minutes = Math.floor(diffMinutes)
  return minutes < 2 ? 'a minute ago' : `${minutes} minutes ago`
}

export const formatDescription = (description: string) => {
  return description.replace(
    /\*\*(.*?)\*\*/g,
    '<strong className="text-lg">$1</strong>',
  )
}

export function getAddress(job: Record<string, unknown>) {
  const { province, city_muni, barangay } = job as {
    province: string
    city_muni: string
    barangay: string
  }

  let address = ''
  if (barangay) address += `${barangay}, `
  if (city_muni) address += `${city_muni}, `
  if (province) address += `${province}`

  return address
}

export const buildChartConfig = (
  data: DataItem[],
  labelKey: string = 'name',
  colorGenerator: (index: number) => string = generateColor,
): ChartConfig => {
  const config: ChartConfig = {}

  data.forEach((item, index) => {
    const key = item[labelKey]?.toLowerCase()
    config[key] = {
      label: item[labelKey],
      color: colorGenerator(index),
    }
  })
  return config
}

const generateColor = (index: number): string => {
  const colorIndex = (index % MAX_COLOR_VARIABLES) + 1
  return `hsl(var(--chart-${colorIndex}))`
}

export const addColorsToChartData = (
  data: DataItem[],
  config: ChartConfig,
  labelKey: string = 'name',
) => {
  return data.map((item) => {
    const itemKey = item[labelKey]?.toLowerCase()
    return {
      ...item,
      fill: config[itemKey]?.color || 'hsl(var(--chart-default))',
    }
  })
}

export const getDateMonth = (date: Date): string => {
  return new Date(date).toLocaleString('default', {
    month: 'long',
  })
}

export function calculateTrend(
  current: number | undefined,
  previous: number | undefined,
): { trendText: string; isTrendingUp: boolean } {
  const currentVal: number = current ?? 0
  const previousVal: number = previous ?? 0

  const trendChange: number = previousVal
    ? ((currentVal - previousVal) / previousVal) * 100
    : 0
  const isTrendingUp: boolean = trendChange > 0

  const trendText: string = isTrendingUp
    ? `Trending up by ${trendChange.toFixed(1)}%`
    : `Trending down by ${Math.abs(Number(trendChange.toFixed(1)))}%`

  return { trendText, isTrendingUp }
}
