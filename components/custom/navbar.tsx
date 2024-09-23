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
//import useIsAuthenticated from '@/hooks/useIsAuthenticated'
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
  const navbarRoutes = useNavbarRoutes()
  const activePath = useActivePath()
  //const isAuthenticated = useIsAuthenticated()

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
            <div
              className={`flex md:items-center md:justify-center space-x-2 md:space-x-1`}
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  {' '}
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

                <ul className="justify-center items-center space-y-5 mt-8 md:flex md:space-x-6 md:space-y-0">
                  {navbarRoutes.map((route, idx) => (
                    <li
                      key={idx}
                      className={cn(
                        'text-gray-600 hover:text-primary relative md:py-5',
                        activePath === route.path ||
                          (route.path !== '/' &&
                            activePath.startsWith(route.path))
                          ? 'text-primary'
                          : '',
                      )}
                    >
                      <Link href={route.path}>{route.label}</Link>
                    </li>
                  ))}
                  <li className="w-fit mx-auto">
                    <form
                      action="/auth/logout"
                      method="post"
                      className="w-fit"
                    >
                      <Button variant="destructive">Logout</Button>
                    </form>
                  </li>
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="flex-1 justify-self-center pb-3 md:block md:pb-0 md:mt-0 hidden">
          <ul className="justify-center items-center space-y-5 md:flex md:space-x-6 md:space-y-0">
            {navbarRoutes.map((route, idx) => (
              <li
                key={idx}
                className={cn(
                  'text-gray-600 hover:text-primary relative md:py-5',
                  // Apply 'text-primary' for the active path
                  activePath === route.path ||
                    (route.path !== '/' && activePath.startsWith(route.path))
                    ? 'text-primary'
                    : '',
                )}
              >
                <Link href={route.path}>{route.label}</Link>
                {/* Span positioned at the bottom */}
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
          </ul>
        </div>

        <div className="md:flex hidden md:items-center md:justify-center space-x-2 md:space-x-1 mt-2 md:pb-0 md:mt-0">
          {!user ? (
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  {' '}
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

                <ul className="justify-center items-center space-y-5 mt-8 md:flex md:space-x-6 md:space-y-0">
                  {navbarRoutes.map((route, idx) => (
                    <li
                      key={idx}
                      className={cn(
                        'text-gray-600 hover:text-primary relative md:py-5',
                        activePath === route.path ||
                          (route.path !== '/' &&
                            activePath.startsWith(route.path))
                          ? 'text-primary'
                          : '',
                      )}
                    >
                      <Link href={route.path}>{route.label}</Link>
                    </li>
                  ))}
                  <li className="w-fit mx-auto">
                    <form
                      action="/auth/logout"
                      method="post"
                      className="w-fit"
                    >
                      <Button variant="destructive">Logout</Button>
                    </form>
                  </li>
                </ul>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  )
}
