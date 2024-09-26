'use client'

import { logout } from '@/actions/logout'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Logout = () => {
  const router = useRouter()

  const handleLogout = async () => {
    const response = await logout()

    if (response?.error) {
      console.error('Logout failed:', response.error)
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      className="w-full"
    >
      Logout
    </Button>
  )
}

export default Logout
