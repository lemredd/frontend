'use client'

import withSeekerProtection from '@/hoc/withSeekerProtection'

const SeekerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main className="container mx-auto flex h-screen flex-col my-24">
      {children}
    </main>
  )
}

export default withSeekerProtection(SeekerLayout)
