import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
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
