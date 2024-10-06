"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { MapPin, Pencil } from "lucide-react"

interface Props {
  address?: Record<string, string>
}
export function EditAddressForm({ address }: Props) {
  // TODO: add form
  const content = [address?.barangay, address?.city_muni, address?.province].join(", ")
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-max flex gap-x-2 [&:hover_>.pencil]:block [&:hover_>.map-pin]:hidden">
          <MapPin size={16} className="map-pin" />
          <Pencil size={16} className="pencil hidden" />
          <span>{content}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Edit your address
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
