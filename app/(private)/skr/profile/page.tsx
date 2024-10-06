"use client"

import { useAuthStore } from "@/store/AuthStore"

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div>
      <h1>Profile</h1>
    </div>
  )
}
