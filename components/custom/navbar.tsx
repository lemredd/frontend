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
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { RiUserSearchFill } from 'react-icons/ri'

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navbarRoutes = useNavbarRoutes(user?.user_metadata?.role_code)
  const activePath = useActivePath()
  const [showBackground, setShowBackground] = useState<boolean>(false)
  const [showNavbar, setShowNavbar] = useState<boolean>(true)
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0)

  const TOP_OFFSET = 50

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY
    if (currentScrollPos <= TOP_OFFSET) {
      setShowNavbar(true)
    } else if (currentScrollPos > prevScrollPos) {
      setShowNavbar(false)
    } else {
      setShowNavbar(true)
    }

    setShowBackground(currentScrollPos >= TOP_OFFSET)
    setPrevScrollPos(currentScrollPos)
  }, [prevScrollPos])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const renderNavbarLinks = (fromSheet: boolean) => (
    <>
      {navbarRoutes.map((route, idx) => (
        <li
          key={idx}
          className={cn(
            'text-foreground hover:text-primary relative',
            activePath === route.path ||
              (route.path !== '/' && activePath.startsWith(route.path))
              ? 'text-primary dark:text-blue-300'
              : showBackground
              ? 'text-foreground'
              : 'text-foreground',
            fromSheet && 'text-foreground',
          )}
        >
          <Link
            href={route.path}
            scroll={true}
          >
            {route.label}
          </Link>{' '}
        </li>
      ))}
    </>
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
        showNavbar ? 'top-0 opacity-100' : '-top-20 opacity-0',
        showBackground ? 'bg-background shadow-lg py-3' : 'bg-transparent py-6',
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6 2xl:px-0">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2"
        >
          <RiUserSearchFill
            className={cn('text-2xl', !showBackground && 'text-foreground')}
          />
          <h1
            className={cn(
              'text-xl font-bold hidden md:block',
              !showBackground && 'text-foreground',
            )}
          >
            Task Grabber
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <ul className="flex space-x-6">{renderNavbarLinks(false)}</ul>
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
              <ul className="space-y-5 mt-8">{renderNavbarLinks(true)}</ul>
              <div className="mt-6">{renderAuthButtons(true)}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
