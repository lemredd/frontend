'use client'

import { CollapsibleDesc } from '@/components/custom/collapsible-desc'
import { EditForm } from '@/components/custom/profile/edit-form'
import {
  SeekerVerificationList,
  VerificationList,
} from '@/components/custom/profile/verification-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { PROFILE_STORE_FIELDS } from '@/lib/constants'
import { Profile, useAuthStore } from '@/store/AuthStore'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EditAddressForm } from './edit-address-form'
import { ProfilePicture } from './picture'
import { ProfileRating } from './rating'
import { SeekerSkillsList } from './skills-list'
import { SeekerDocuments } from './documents'

export function OwnProfileHeader() {
  const { profile, user } = useAuthStore()

  const joinedDate = new Date(profile?.created_at).toLocaleDateString('PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="shadow-lg rounded-md md:p-4 xl:p-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
        {/* Avatar and Edit Button */}
        <ProfilePicture
          profile={profile}
          isEditable
        />

        {/* Profile Information */}
        <div className="flex-grow text-center sm:text-left space-y-3">
          <div className="flex flex-col space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <span className="text-md text-gray-500">
              {profile?.username
                ? `@ ${profile.username}`
                : 'Username not provided'}
            </span>
          </div>
          {/* Rating Section */}
          <div className="flex justify-center sm:justify-start items-center space-x-2">
            <ProfileRating profile={profile} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Short Description and Address */}
        <div className="space-y-2 text-center md:text-left flex flex-col items-center md:items-start justify-center">
          <h2 className="text-lg sm:text-xl font-semibold text-primary">
            {profile?.short_desc || 'No short description available'}
          </h2>
          <EditAddressForm address={profile?.addresses?.[0] || null} />
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

        {/* Skills List */}
        {user?.user_metadata.role_code === 'SKR' && (
          <SeekerSkillsList
            skills={profile?.profile_skills}
            isEditable
          />
        )}

        {/* Verification List */}
        <VerificationList />

        {/* Documents */}
        <SeekerDocuments profile={profile} />
      </CardContent>
    </Card>
  )
}

interface ProfileHeaderProps {
  username: string
}
export function ProfileHeader({ username }: ProfileHeaderProps) {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [addressContent, setAddressContent] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('profiles')
      .select(PROFILE_STORE_FIELDS)
      .eq('username', username)
      .single()
      .then(({ data, error }) => {
        if (error) return console.error(error)

        // ! TODO: handle properly if profile is not completed
        // if (!data.is_completed) router.push('/skr/profile')
        setProfile(data)
        setAddressContent(
          profile?.address
            ? [
              profile.address?.barangay,
              profile.address?.city_muni,
              profile.address?.province,
            ].join(', ')
            : 'No address yet',
        )
      })
  }, [supabase, username, router, profile?.address])

  const joinedDate = new Date(profile?.created_at).toLocaleDateString('PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="shadow-lg rounded-md md:p-4 xl:p-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
        {/* Avatar and Edit Button */}
        <ProfilePicture profile={profile} />

        {/* Profile Information */}
        <div className="flex-grow text-center sm:text-left space-y-3">
          <div className="flex flex-col space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <span className="text-md text-gray-500">
              {profile?.username
                ? `@ ${profile.username}`
                : 'Username not provided'}
            </span>
          </div>
          {/* Rating Section */}
          <div className="flex justify-center sm:justify-start items-center space-x-2">
            <ProfileRating profile={profile} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Short Description and Address */}
        <div className="space-y-2 text-center md:text-left flex flex-col items-center md:items-start justify-center">
          <h2 className="text-lg sm:text-xl font-semibold text-primary">
            {profile?.short_desc || 'No short description available'}
          </h2>
          <div className="text-gray-500 text-sm">
            <span>Joined {joinedDate}</span>
          </div>

          <span>{addressContent}</span>
        </div>

        {/* Collapsible Long Description */}
        <CollapsibleDesc
          content={profile?.long_desc || 'No detailed description provided'}
          className="break-words text-center md:text-left"
        />

        <SeekerSkillsList skills={profile?.profile_skills} />

        {/* Verification List */}
        <SeekerVerificationList username={username} />
        <hr className="hidden lg:block" />

        {/* Verification List */}
        <SeekerDocuments profile={profile} />
      </CardContent>
    </Card>
  )
}
