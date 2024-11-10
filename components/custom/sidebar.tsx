'use client'

import {
  BriefcaseBusiness,
  ChevronRight,
  ChevronsUpDown,
  Home,
  Lightbulb,
  Settings2,
  Users,
} from 'lucide-react'

import Logout from '@/components/custom/auth/logout'
import { ProfilePicture } from '@/components/custom/profile/picture'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import useActivePath from '@/hooks/useActivePath'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/AuthStore'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { RiUserSearchFill } from 'react-icons/ri'

const data = {
  dashboards: [
    { name: 'Overview', url: '/admin/', icon: Home },
    { name: 'Users', url: '/admin/users/', icon: Users },
    { name: 'jobs', url: '/admin/jobs/', icon: BriefcaseBusiness },
    { name: 'Skills', url: '/admin/skills/', icon: Lightbulb },
  ],
  settings: [
    {
      title: 'Settings',
      icon: Settings2,
      items: [
        { title: 'Profile', url: '/settings/profile/' },
        { title: 'Preferences', url: '/settings/preferences/' },
        { title: 'Security', url: '/settings/security/' },
      ],
    },
  ],
}

export function AdminSidebar() {
  const user = useAuthStore((state) => state.user) as User
  const { email } = user || {}
  const profile = useAuthStore((state) => state.profile)
  const activePath = useActivePath()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className="inline-flex items-center px-2 space-x-2 h-12 text-sm"
            >
              <RiUserSearchFill className="text-2xl" />
              <h1 className={cn('text-xl font-bold ')}>Task Grabber</h1>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Dashboard Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            {data.dashboards.map((item) => {
              const isActive =
                activePath === item.url ||
                (activePath === '/' && item.url === '/admin/')
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={
                      isActive
                        ? 'bg-primary text-white hover:bg-primary hover:text-white'
                        : ''
                    }
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span className="capitalize">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Settings Section with Collapsible */}
        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarMenu>
            {data.settings.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isActive = activePath === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                isActive ? 'bg-gray-700 text-white' : '',
                              )}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Section in Footer */}
      <SidebarFooter className="p-4 border-t border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <ProfilePicture
                    profile={profile}
                    size="sm"
                  />
                  <div className="text-left">
                    <span className="block font-semibold">
                      {profile?.username}
                    </span>
                    <span className="block text-xs text-gray-400">{email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 rounded-md">
                <DropdownMenuLabel className="text-gray-200 px-4 py-2">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Logout className="w-full" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
