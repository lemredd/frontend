'use client'

import { ProfileJobList } from '@/components/custom/job/job-list'
import { OwnProfileHeader } from '@/components/custom/profile/profile-header'
import Spinner from '@/components/custom/spinner'
import { useAuthStore } from '@/store/AuthStore'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { refreshUser, isLoading } = useAuthStore()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refreshUser(), [])

  if (isLoading) return <Spinner />

  return (
    <>
      <OwnProfileHeader />
      <ProfileJobList role="seeker" />
    </>
  )

}
