"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function VerifyPage() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Email Verification sent</h2>
        </CardHeader>
        <CardContent>
          <p>Check your email for verification link</p>
        </CardContent>
      </Card>
    </main>
  )
}
