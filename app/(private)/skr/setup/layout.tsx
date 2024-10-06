'use client'

import withSeekerProtection from '@/hoc/withSeekerProtection'

const SeekerSetupLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main className="container mx-auto flex h-full min-h-screen flex-col justify-center">
      {children}
    </main>
  )
}

export default withSeekerProtection(SeekerSetupLayout)
