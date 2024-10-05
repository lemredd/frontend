"use client"

import { useEffect } from 'react'

import { JobForm } from '@/components/custom/job/job-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/store/AuthStore'

export default function ProviderSetupPage() {
  const { refreshUser } = useAuthStore()

  // Refresh user from store. User is redirected to this page after confirming email
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refreshUser(), [])

  return (
    <section className="flex items-center justify-center w-full px-6 md:px-0">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-light">
            Tell us what needs to be <strong className='font-bold'>done.</strong>
          </CardTitle>
          <CardDescription>
            {"We'll"} guide you to create the perfect brief. The more detail the
            better.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm />
        </CardContent>
      </Card>
    </section>
  )
}
