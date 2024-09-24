'use client'

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
import { RiUserSearchFill } from 'react-icons/ri'

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  const navbarRoutes = useNavbarRoutes(user?.user_metadata?.role_code)
  const activePath = useActivePath()
  const renderNavbarLinks = () => (
    <>
      {navbarRoutes.map((route, idx) => (
        <li
          key={idx}
          className={cn(
            'text-gray-600 hover:text-primary relative md:py-5',
            activePath === route.path ||
              (route.path !== '/' && activePath.startsWith(route.path))
              ? 'text-primary'
              : '',
          )}
        >
          <Link href={route.path}>{route.label}</Link>
          <span
            className={cn(
              'absolute left-0 bottom-0 w-full h-1 bg-primary',
              activePath === route.path ||
                (route.path !== '/' && activePath.startsWith(route.path))
                ? 'scale-0 md:scale-100'
                : 'scale-0',
            )}
          />
        </li>
      ))}
    </>
  )

  const renderAuthButtons = () =>
    !user ? (
      <>
        <Button
          variant="ghost"
          asChild
        >
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/join">Join Now</Link>
        </Button>
      </>
    ) : (
      <form
        action="/auth/logout"
        method="post"
      >
        <Button variant="destructive">Logout</Button>
      </form>
    )

  return (
    <nav className="fixed top-0 z-50 bg-background w-full shadow-sm py-5 md:py-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between md:block">
          <Link
            href="/"
            className="inline-flex space-x-1 items-center"
          >
            <RiUserSearchFill className="size-6 fill-primary" />
            <h1 className="text-xl font-bold text-primary">Task Grabber</h1>
          </Link>
          <div className="md:hidden flex items-center space-x-2">
            <div className="flex space-x-2">{renderAuthButtons()}</div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="inline-flex space-x-1 items-center">
                    <RiUserSearchFill className="size-6 fill-primary" />
                    <h1 className="text-xl font-bold text-primary">
                      Task Grabber
                    </h1>
                  </SheetTitle>
                </SheetHeader>
                <ul className="space-y-5 mt-8">
                  {renderNavbarLinks()}
                  <li className="w-fit mx-auto">{renderAuthButtons()}</li>
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="hidden md:flex flex-1 justify-center space-x-6">
          <ul className="flex space-x-6">{renderNavbarLinks()}</ul>
        </div>
        <div className="hidden md:flex space-x-2">{renderAuthButtons()}</div>
      </div>
    </nav>
  )
}
