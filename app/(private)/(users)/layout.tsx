import Breadcrumb from '@/components/custom/breadcrumb'
import Footer from '@/components/custom/footer'
import { Navbar } from '@/components/custom/navbar'

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <section className="mt-28 mb-16 space-y-8 container mx-auto flex h-full min-h-screen flex-col px-6 2xl:px-0">
        <Breadcrumb />
        {children}
      </section>
      <Footer />
    </>
  )
}
