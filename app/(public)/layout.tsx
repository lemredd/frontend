export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="mt-10 w-full flex flex-col items-center justify-center min-h-screen ">
      {children}
    </section>
  )
}
