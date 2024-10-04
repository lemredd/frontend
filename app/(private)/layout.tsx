export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <section className="my-24">{children}</section>
}
