'use client'

import Logout from '@/components/custom/auth/logout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, getInitialLetter } from '@/lib/utils'
import { useAuthStore } from '@/store/AuthStore'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface AccountMenuProps {
  className?: string
}

export default function AccountMenu({ className }: AccountMenuProps) {
  const user = useAuthStore((state) => state.user) as User
  // const profile = useAuthStore((state) => state.profile)
  const { first_name, last_name, email, role_code } = user?.user_metadata || {}

  const fullName = `${first_name ?? ''} ${last_name ?? ''}`.trim()
  const avatarFallback = `${getInitialLetter(
    first_name ?? '',
  )}${getInitialLetter(last_name ?? '')}`

  const dropdownItems = [
    { label: 'Profile', href: `/${role_code.toLowerCase()}/profile/` },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative rounded-full', className)}
        >
          <Avatar className="size-full">
            {/* TODO: ADD AVATAR IMAGE */}
            <AvatarImage
              src="#"
              alt="avatar"
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {fullName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {dropdownItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="cursor-pointer"
            >
              <Link
                href={item.href}
                className="w-full"
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Logout className="w-full" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
