import Footer from '@/components/custom/footer'
import { Navbar } from '@/components/custom/navbar'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <section className="w-full flex flex-col items-center justify-center min-h-screen ">
        {children}
      </section>
      <Footer />
    </>
  )
}
