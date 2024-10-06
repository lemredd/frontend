"use client"

import { OwnProfileHeader } from "@/components/custom/profile/profile-header"
import { useAuthStore } from "@/store/AuthStore"
import { useEffect } from "react"

export default function ProfilePage() {
  const { refreshUser } = useAuthStore()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refreshUser(), [])

  return (
    <OwnProfileHeader />
  )
}
