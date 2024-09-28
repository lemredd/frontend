import { TNavbarRoute, UserRole } from '@/constants/types'
import { useMemo } from 'react'

const useNavbarRoutes = (role?: UserRole): TNavbarRoute[] => {
  const NavbarRoutes: TNavbarRoute[] = useMemo(() => {
    // Routes for unauthenticated users
    const publicRoutes: TNavbarRoute[] = [
      { label: 'Home', path: '/#' },
      { label: 'About', path: '/#about' },
      { label: 'Contact Us', path: '/#contact-us' },
    ]

    // Routes for SKRs
    const seekerRoutes: TNavbarRoute[] = [
      { label: 'Home', path: '/skr' },
      { label: 'Grab Tasks', path: '/skr/tasks' },
      { label: 'Profile', path: '/skr/profile' },
    ]

    // Routes for PDRs
    const providerRoutes: TNavbarRoute[] = [
      { label: 'Home', path: '/pdr' },
      { label: 'Post Tasks', path: '/pdr/tasks/post' },
      { label: 'Profile', path: '/pdr/profile' },
    ]

    // Routes for admin
    const adminRoutes: TNavbarRoute[] = [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Manage Users', path: '/admin/users' },
      { label: 'Settings', path: '/admin/settings' },
    ]

    // Return different routes based on the role
    if (role === 'SKR') {
      return seekerRoutes
    } else if (role === 'PDR') {
      return providerRoutes
    } else if (role === 'ADMIN') {
      return adminRoutes
    } else {
      return publicRoutes // For unauthenticated users
    }
  }, [role])

  return NavbarRoutes
}

export default useNavbarRoutes
