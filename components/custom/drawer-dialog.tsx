import * as React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

interface DrawerDialogProps {
  isButton?: boolean
  title: string
  trigger: string
  description?: string
  content: React.ReactNode | string
  triggerClass?: string
  closeText?: string
}

const DrawerDialog = ({
  isButton = false,
  title,
  trigger,
  description,
  content,
  triggerClass,
  closeText = 'Cancel',
}: DrawerDialogProps) => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger
          asChild
          className={!isButton ? '' : ''}
        >
          {isButton ? (
            <Button variant="outline">{trigger}</Button>
          ) : (
            <span
              className={cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer',
                triggerClass,
              )}
            >
              {trigger}
            </span>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] overflow-auto">
            {content}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        {isButton ? (
          <Button
            variant="outline"
            className={triggerClass}
          >
            {trigger}
          </Button>
        ) : (
          <span
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer',
              triggerClass,
            )}
          >
            {trigger}
          </span>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <ScrollArea className="p-4 max-h-[60vh] overflow-auto">
          {content}
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{closeText}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerDialog
