import { UserRole } from '@/constants/types'
import useNavbarRoutes from '@/hooks/useNavbarRoutes'
import Link from 'next/link'

interface FooterProps {
  role?: UserRole
}

export const Footer = ({ role }: FooterProps) => {
  const navbarRoutes = useNavbarRoutes(role)
  console.log(navbarRoutes)
  return (
    <footer className="w-full pt-8 bg-background text-foreground">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">Task Grabber</h3>
          <p>
            a go-to platform for posting tasks and finding opportunities.
            Whether you're looking to get help or offer your skills, we've got
            you covered.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {navbarRoutes.map((route) => (
              <li key={route.path}>
                <Link href={route.path}>{route.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p>Email: support@taskgrabber.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>

      <div className="mt-8 text-sm bg-foreground text-background py-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Task Grabber. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
