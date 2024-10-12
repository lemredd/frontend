import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const roleCodes = ['admin', 'skr', 'pdr']

// Check if the segment is a UUID
const isCombinationWithHyphen = (segment: string) =>
  /[^\s-]+(-[^\s-]+)+/.test(segment)

// Utility function to convert plural to singular
const singularize = (word: string) => {
  if (word.endsWith('s')) {
    return word.slice(0, -1) // Naively remove the last 's' to make it singular
  }
  return word // Return as is if it's already singular
}

export const useBreadcrumb = () => {
  const pathname = usePathname()

  // Parse the route and generate breadcrumbs
  const breadcrumbs = useMemo(() => {
    const pathArray = pathname
      .split('/')
      .filter((path) => path && !roleCodes.includes(path))

    return pathArray.map((path, index) => {
      const href = '/' + pathArray.slice(0, index + 1).join('/')

      // Use the singularized name for UUID segments
      const name = isCombinationWithHyphen(path)
        ? singularize(pathArray[index - 1] || '') // Singularize the previous segment for UUID
        : path.charAt(0).toUpperCase() + path.slice(1) // Capitalize normal path segments

      return { href, name }
    })
  }, [pathname])

  return breadcrumbs
}
