"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/store/AuthStore"
import { ProviderProfileHeader } from "@/components/custom/profile/profile-header"

interface Props {
  params: { username: string }
}

export default function ProviderProfilePage({ params: { username } }: Props) {
  const { profile } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!profile) return
    if (profile.username === username) router.push("/skr/profile")
  }, [profile, router, username])

  return (
    <section className="container mx-auto h-screen">
      <ProviderProfileHeader username={username} />
      {/* TODO: list jobs posted by provider */}
    </section>
  )
}
