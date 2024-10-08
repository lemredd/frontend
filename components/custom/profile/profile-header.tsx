'use client'

import { CollapsibleDesc } from '@/components/custom/collapsible-desc'
import { EditForm } from '@/components/custom/profile/edit-form'
import { VerificationList } from '@/components/custom/profile/verification-list'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useAuthStore } from '@/store/AuthStore'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Edit, Share2, Star } from 'lucide-react'
import { EditAddressForm } from './edit-address-form'

export function OwnProfileHeader() {
  const { profile } = useAuthStore()
  const avatarSrc = 'https://placehold.co/150'

  const joinedDate = new Date(profile?.created_at).toLocaleDateString('PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="container px-6 md:px-0 mx-auto">
      <Card className="shadow-lg rounded-md max-w-4xl mx-auto p-4 sm:p-6">
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
          {/* Avatar and Edit Button */}
          <div className="relative mx-auto sm:mx-0">
            <Avatar className="size-32 rounded-full shadow-md border-4 border-primary">
              <AvatarImage
                src={avatarSrc}
                alt="Profile Avatar"
              />
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <Edit size={16} />
            </Button>
          </div>

          {/* Profile Information */}
          <div className="flex-grow text-center sm:text-left">
            <div className="flex flex-col space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <span className="text-md text-gray-500">
                @{profile?.username}
              </span>
            </div>
            {/* Rating Section */}
            <div className="flex justify-center sm:justify-start items-center space-x-2 mt-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="text-yellow-500 w-5 h-5"
                />
              ))}
              <span className="text-lg font-semibold text-gray-600">0.0</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Short Description and Address */}
          <div className="space-y-2 text-center md:text-left flex flex-col items-center md:items-start justify-center">
            <h2 className="text-lg sm:text-xl font-semibold text-primary">
              {profile?.short_desc || 'No short description available'}
            </h2>
            <EditAddressForm address={profile?.addresses[0]} />
            <div className="text-gray-500 text-sm">
              <span>Joined {joinedDate}</span>
            </div>
          </div>

          {/* Collapsible Long Description */}
          <CollapsibleDesc
            content={profile?.long_desc || 'No detailed description provided'}
            className="break-words text-center md:text-left"
          />

          {/* Button Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex justify-center sm:justify-start gap-x-4">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <Share2 />
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-primary text-white px-6 hover:bg-primary-dark mx-auto sm:mx-0">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:w-[720px] max-w-[unset]">
                <EditForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Verification List */}
          <VerificationList />
        </CardContent>
      </Card>
    </main>
  )
}
