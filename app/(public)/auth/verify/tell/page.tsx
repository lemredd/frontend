'use client'

import { FormError } from '@/components/custom/form-error'
import Spinner from '@/components/custom/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuthStore } from '@/store/AuthStore'
import { Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function VerifyPage() {
  const [isPending, startTransition] = useTransition()
  const resend = useAuthStore((state) => state.resend)
  const [error, setError] = useState<string | undefined>('')
  const searchParmas = useSearchParams()
  const email = searchParmas.get('email') || ''

  const resendEmail = async () => {
    startTransition(() => {
      resend(email).catch((error: Error) => {
        if (error) setError(error.message)
      })
    })
  }

  return (
    <main className="flex h-full flex-col items-center justify-center p-4 d">
      <Card className="shadow-lg max-w-md w-full rounded-lg p-6 bg-white border border-gray-200">
        <CardHeader className="flex flex-col items-center">
          <Mail className="w-16 h-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            Verification Email Sent!
          </h2>
        </CardHeader>
        <CardContent className="text-center flex flex-col space-y-4">
          <p className="text-gray-600">
            Please check your inbox for a verification link to complete your
            sign-up.
          </p>
          <p className="text-sm text-gray-500">
            If you haven&apos;t received the email, check your spam folder or
            <span className="text-blue-500"> resend</span> the email.
          </p>
          <FormError message={error} />
          <Button
            className="mt-6 w-full"
            onClick={resendEmail}
            disabled={isPending}
          >
            {isPending ? <Spinner size="sm" /> : 'Resend Verification Email'}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
