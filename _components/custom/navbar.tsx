'use client'

import Link from 'next/link'

// import { Icons } from '@/components/icons'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { RiUserSearchFill } from 'react-icons/ri'
import useActivePath from '../../_hooks/useActivePath'
import useNavbarRoutes from '../../_hooks/useNavbarRoutes'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

export function Navbar() {
  const navbarRoutes = useNavbarRoutes()
  const activePath = useActivePath()

  const [state, setState] = useState(false)

  return (
    <nav className="fixed top-0 z-50 bg-background w-full shadow-sm py-5 md:py-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between  md:block">
          <Link
            href="/"
            className="inline-flex space-x-1 items-center"
          >
            <RiUserSearchFill className="size-6 fill-primary" />
            <h1 className="text-xl font-bold text-primary">Task Grabber</h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? 'block' : 'hidden'
          }`}
        >
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

        <div
          className={`flex md:items-center md:justify-center space-x-2 md:space-x-1 mt-2 md:block md:pb-0 md:mt-0 ${
            state ? 'block' : 'hidden'
          }`}
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
      </div>
    </nav>
  )
}
