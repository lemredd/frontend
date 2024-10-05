'use client'

import AccountMenu from '@/components/custom/account-menu'
import { ModeToggle } from '@/components/custom/toggle-dark'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import useActivePath from '@/hooks/useActivePath'
import useNavbarRoutes from '@/hooks/useNavbarRoutes'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/AuthStore'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { RiUserSearchFill } from 'react-icons/ri'

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navbarRoutes = useNavbarRoutes(user?.user_metadata?.role_code)
  const activePath = useActivePath()
  const [showBackground, setShowBackground] = useState<boolean>(false)
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0)

  const TOP_OFFSET = 50

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY

    setShowBackground(currentScrollPos >= TOP_OFFSET)
    setPrevScrollPos(currentScrollPos)
  }, [prevScrollPos])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Liquid link rendering function
  const renderLiquidLinks = (links: { path: string; label: string }[]) => (
    <motion.ul
      style={{
        filter: 'url(#goo)', // Apply liquid effect
      }}
      layout
      className="h-7 flex"
    >
      {user && !profile?.is_completed
        ? null
        : links.map((route, index) => {
            // Check if the current route is exactly the home path
            const isExactHomeMatch = route.path === activePath

            // Check if it's a valid subpath but not the exact home
            const isSubPath =
              activePath.startsWith(route.path) &&
              activePath !== route.path &&
              route.path !== '/skr/' && // Avoid making /skr/ always true
              route.path !== '/pdr/' // Avoid making /pdr/ always true

            // Set the active state if it's an exact match or subpath
            const isActive = isExactHomeMatch || isSubPath

            return (
              <motion.li
                key={index}
                className={cn(
                  'px-3 h-full items-center mx-0 transition-all duration-500 cursor-pointer justify-center flex capitalize font-bold',
                  user && 'bg-background/50 text-foreground',
                  isActive && 'bg-primary text-white mx-6',
                )}
              >
                <Link href={route.path}>{route.label}</Link>
              </motion.li>
            )
          })}
    </motion.ul>
  )

  const renderAuthButtons = (fromSheet: boolean) =>
    !user ? (
      <div
        className={cn(
          'flex',
          fromSheet
            ? 'flex-col space-y-3 items-center justify-center'
            : 'space-x-3 ',
        )}
      >
        <Button
          variant="outline"
          asChild
          className={fromSheet ? 'w-full' : 'hidden md:flex'}
        >
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button
          asChild
          className={fromSheet ? 'w-full' : 'hidden md:flex'}
        >
          <Link href="/auth/join">Join Now</Link>
        </Button>
        <ModeToggle className={fromSheet ? 'hidden' : ''} />
      </div>
    ) : (
      <div
        className={cn(
          'flex',
          fromSheet
            ? 'flex-col space-y-3 items-center justify-center'
            : 'space-x-3',
        )}
      >
        <ModeToggle className={fromSheet ? 'hidden' : ''} />
        <AccountMenu className={fromSheet ? 'hidden' : ''} />
      </div>
    )

  if (isLoading) return null

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        showBackground ? 'bg-background shadow-lg py-3' : 'bg-transparent py-6',
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6 2xl:px-0">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2"
        >
          <RiUserSearchFill className="text-2xl" />
          <h1 className={cn('text-xl font-bold hidden md:block')}>
            Task Grabber
          </h1>
        </Link>

        {/* Desktop Links with Liquid Effect */}
        <div className="hidden md:flex space-x-6">
          {renderLiquidLinks(navbarRoutes)}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex space-x-2">
          {renderAuthButtons(false)}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          {renderAuthButtons(false)}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="inline-flex items-center space-x-1">
                  <RiUserSearchFill className="text-primary text-2xl" />
                  <h1 className="text-xl font-bold text-primary">
                    Task Grabber
                  </h1>
                </SheetTitle>
              </SheetHeader>
              <ul className="space-y-5 mt-8">
                {renderLiquidLinks(navbarRoutes)}
              </ul>
              <div className="mt-6">{renderAuthButtons(true)}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
