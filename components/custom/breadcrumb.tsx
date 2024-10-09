'use client'

import {
  Breadcrumb as BCrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ITEMS_TO_DISPLAY } from '@/lib/constants'
import { useAuthStore } from '@/store/AuthStore'
import Link from 'next/link'
import React from 'react'

const Breadcrumb = () => {
  const breadcrumbs = useBreadcrumb()
  const { user } = useAuthStore()
  const role_code = user?.user_metadata?.role_code.toLowerCase()
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  console.log(user)
  return (
    <BCrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href={`/${role_code}`}>Home</Link>
        </BreadcrumbItem>
        {breadcrumbs.length > ITEMS_TO_DISPLAY && ITEMS_TO_DISPLAY > 0 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu
                  open={open}
                  onOpenChange={setOpen}
                >
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="Toggle menu"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbs
                      .slice(0, -ITEMS_TO_DISPLAY)
                      .map((breadcrumb, index) => (
                        <DropdownMenuItem key={index}>
                          <Link
                            href={`/${role_code}` + breadcrumb.href}
                            className="w-full"
                          >
                            {breadcrumb.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer
                  open={open}
                  onOpenChange={setOpen}
                >
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>
                        Select a page to navigate to.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {breadcrumbs
                        .slice(0, -ITEMS_TO_DISPLAY)
                        .map((breadcrumb, index) => (
                          <Link
                            key={index}
                            href={`/${role_code}` + breadcrumb.href}
                            className="py-1 text-sm"
                          >
                            {breadcrumb.name}
                          </Link>
                        ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
          </>
        ) : null}

        {breadcrumbs.slice(-ITEMS_TO_DISPLAY).map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.href || index}>
            <BreadcrumbSeparator />
            {index === breadcrumbs.slice(-ITEMS_TO_DISPLAY).length - 1 ? (
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {breadcrumb.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <Link
                  className="capitalize"
                  href={`/${role_code}` + breadcrumb.href}
                >
                  {breadcrumb.name}
                </Link>
              </BreadcrumbItem>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BCrumb>
  )
}

export default Breadcrumb
