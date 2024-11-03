'use client'

import { useRouter } from 'next/navigation'

import { ProfileHeader } from '@/components/custom/profile/profile-header'
import { useAuthStore } from '@/store/AuthStore'
import { useEffect } from 'react'

interface Props {
  params: { username: string }
}

export default function ProviderProfilePage({ params: { username } }: Props) {
  const { profile } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!profile) return
    if (profile.username === username) router.push('/skr/profile')
  }, [profile, router, username])

  return (
    <section className="container mx-auto h-screen">
      <ProfileHeader username={username} />
      {/* TODO: list jobs posted by provider */}
    </section>
  )
}
