const ProviderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main className="container mx-auto flex h-screen flex-col justify-center">
      {children}
    </main>
  )
}

export default ProviderLayout
