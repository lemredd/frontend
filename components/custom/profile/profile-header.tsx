"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/AuthStore"
import { AvatarImage } from "@radix-ui/react-avatar"
import { Edit, Share2, Star } from "lucide-react"
import { CollapsibleDesc } from "@/components/custom/collapsible-desc"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditForm } from "./edit-form"
import { EditAddressForm } from "./edit-address-form"
import { VerificationList } from "./verification-list"

export function OwnProfileHeader() {
  const { profile } = useAuthStore()
  const avatarSrc = "https://placehold.co/150"

  const joinedDate = new Date(profile?.created_at)
    .toLocaleDateString("PH", { month: "long", day: "numeric", year: "numeric" })

  return (
    <header className="space-y-4">
      <Avatar className="size-[150px] relative rounded-md">
        <AvatarImage src={avatarSrc} />
        <Button variant="secondary" size="icon" className="absolute bottom-2 right-2 rounded-sm"><Edit /></Button>
      </Avatar>
      <section className="grid grid-flow-col grid-cols-[1fr_auto] gap-y-4 grid-rows-[repeat(5,auto)]">
        <h1 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name} <span className="font-normal">@{profile?.username}</span></h1>
        <div className="flex items-center gap-x-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} />
          ))}
          <span className="text-lg">0.0</span>
        </div>
        <h2 className="text-lg font-bold">{profile?.short_desc}</h2>
        <div className="flex gap-x-2 items-center">
          <EditAddressForm address={profile?.addresses[0]} />
          <span className="font-bold">·</span>
          <span>Joined {joinedDate}</span>
        </div>

        <CollapsibleDesc content={profile?.long_desc} />

        <div className="flex gap-x-4">
          <Button size="icon" variant="ghost"><Share2 /></Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="w-[720px] max-w-[unset]">
              <EditForm />
            </DialogContent>
          </Dialog>
        </div>
        <VerificationList />
      </section>
    </header>
  )
}
