import { TNavbarRoute } from '@/_constants/types'
import { useMemo } from 'react'

const useNavbarRoutes = (): TNavbarRoute[] => {
  const NavbarRoutes: TNavbarRoute[] = useMemo(
    () => [
      {
        label: 'Home',
        path: '/',
      },
      {
        label: 'About',
        path: '/about',
      },
      {
        label: 'Contact',
        path: '/contact',
      },
      {
        label: 'Profile',
        path: '/profile',
      },
      {
        label: 'Search',
        path: '/search',
      },
    ],
    [],
  )

  return NavbarRoutes
}

export default useNavbarRoutes
