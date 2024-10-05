'use client'

import withProviderProtection from '@/hoc/withProviderProtection'

const ProviderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main className="container mx-auto flex h-screen flex-col my-28">
      {children}
    </main>
  )
}

export default withProviderProtection(ProviderLayout)
