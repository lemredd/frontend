"use client"

import { useSearchParams } from "next/navigation"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  return (
    <main>
      {searchParams.get("token")}
    </main>
  )
}
