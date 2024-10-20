import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import React from 'react'

interface SetupWrapperProps {
  title: string
  description?: string
  children: React.ReactNode
}

const SetupWrapper = ({ title, description, children }: SetupWrapperProps) => {
  return (
    <section className="flex items-center justify-center w-full px-6 md:px-0">
      <Card className="w-full max-w-5xl">
        <CardHeader className="mb-0 space-y-2">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  )
}

export default SetupWrapper
