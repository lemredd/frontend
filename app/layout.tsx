import { Navbar } from '@/components/custom/navbar'
import { ThemeProvider } from '@/components/providers/theme-provider'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { createClient } from '@/utils/supabase/server'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Task Grabber',
  description: 'Task Grabber',
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar user={user} />
          <main className="w-full 2xl:container h-screen mx-auto pt-20 md:pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
