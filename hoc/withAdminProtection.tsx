'use client'

import Spinner from '@/components/custom/spinner'
import { useAuthStore } from '@/store/AuthStore'
import { ComponentType, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const withAdminProtection = (WrappedComponent: ComponentType<LayoutProps>) => {
  return (props: LayoutProps) => {
    const isLoading = useAuthStore((state) => state.isLoading)

    if (isLoading) {
      return (
        <main className="container mx-auto flex h-screen flex-col justify-center">
          <Spinner />
        </main>
      )
    }

    return <WrappedComponent {...props} />
  }
}

export default withAdminProtection
