export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <section className="mt-28 mb-16">{children}</section>
}
