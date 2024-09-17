'use client'

import Link from 'next/link'

// import { Icons } from '@/components/icons'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import useActivePath from '../../_hooks/useActivePath'
import useNavbarRoutes from '../../_hooks/useNavbarRoutes'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

export function Navbar() {
  const navbarRoutes = useNavbarRoutes()
  const activePath = useActivePath()

  const [state, setState] = useState(false)

  return (
    <nav className="bg-foreground dark:bg-background w-full py-3 md:py-5">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between  md:block">
          <Link href="/">
            <h1 className="text-xl font-bold text-blue-primary">
              Task Grabber
            </h1>
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
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {navbarRoutes.map((route, idx) => (
              <li
                key={idx}
                className={cn(
                  'text-gray-600 hover:text-blue-primary',
                  activePath == route.path &&
                    'md:border-b-2 text-blue-primary border-blue-primary',
                )}
              >
                <Link
                  href={route.path}
                  className=""
                >
                  {route.label}
                </Link>
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
            variant="outline"
            asChild
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            variant="custom"
            asChild
          >
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
