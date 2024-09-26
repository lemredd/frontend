'use client'

import Logout from '@/components/custom/auth/logout'
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
import { User } from '@supabase/supabase-js'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { RiUserSearchFill } from 'react-icons/ri'

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
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
          'hidden sm:flex space-x-3',
          fromSheet && 'flex-col space-y-3',
        )}
      >
        <Button
          variant="ghost"
          asChild
        >
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/join">Join Now</Link>
        </Button>
      </div>
    ) : (
      <Logout />
    )

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
              'text-xl font-bold',
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
