"use client"

import { useAuthStore } from "@/store/AuthStore"
import { useEffect } from "react"

interface Props { children: React.ReactNode }
export default function UnauthenticatedLayout({ children }: Props) {
  const { refreshUser } = useAuthStore()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refreshUser(), [])

  return children
}
