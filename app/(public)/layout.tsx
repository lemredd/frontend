export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen ">
      {children}
    </section>
  )
}
