'use client'

import withSeekerProtection from '@/hoc/withSeekerProtection'

const SeekerLayout = ({
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

export default withSeekerProtection(SeekerLayout)
