'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ProfileHeader } from '@/components/custom/profile/profile-header'
import { useAuthStore } from '@/store/AuthStore'

interface Props {
  params: {
    username: string
  }
}

export default function SkrProfilePage({ params: { username } }: Props) {
  const { profile } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!profile) return
    if (profile.username === username) router.push('/skr/profile')
  }, [profile, router, username])

  return (
    <section className="container mx-auto">
      <ProfileHeader username={username} />
    </section>
  )
}
